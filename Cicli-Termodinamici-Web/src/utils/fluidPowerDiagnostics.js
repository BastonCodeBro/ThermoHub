import { getComponentDefinition } from '../data/fluidPowerCatalog';
import { validateCircuit } from './fluidPowerSimulation';

const toPortKey = (nodeId, portId) => `${nodeId}:${portId}`;

const severityWeight = {
  error: 0,
  warning: 1,
  info: 2,
  success: 3,
};

const sortBySeverity = (issues) =>
  [...issues].sort(
    (first, second) =>
      severityWeight[first.severity] - severityWeight[second.severity] ||
      first.title.localeCompare(second.title, 'it'),
  );

const pushIssue = (issues, issue) => {
  issues.push({
    id: `${issue.severity}-${issue.code}-${issues.length + 1}`,
    ...issue,
  });
};

const buildConnectionMap = (connections) => {
  const connectedPortKeys = new Set();

  connections.forEach((connection) => {
    connectedPortKeys.add(toPortKey(connection.from.nodeId, connection.from.portId));
    connectedPortKeys.add(toPortKey(connection.to.nodeId, connection.to.portId));
  });

  return connectedPortKeys;
};

const getNodeKinds = (nodes) =>
  nodes.map((node) => ({
    node,
    component: getComponentDefinition(node.componentId),
  }));

export const diagnoseFluidWorkspace = (workspace, domain) => {
  const nodes = workspace?.nodes ?? [];
  const connections = (workspace?.connections ?? []).filter((connection) => connection.domain === domain);
  const nets = workspace?.nets ?? [];
  const issues = [];
  const scoped = getNodeKinds(nodes).filter(({ component }) => component?.domain === domain);
  const connectedPortKeys = buildConnectionMap(connections);

  const sources = scoped.filter(({ component }) => component?.simBehavior.kind === 'source');
  const valves = scoped.filter(({ component }) => component?.simBehavior.kind === 'valve');
  const actuators = scoped.filter(({ component }) => component?.simBehavior.kind === 'actuator');
  const sinks = scoped.filter(({ component }) => component?.simBehavior.kind === 'sink');

  if (sources.length === 0) {
    pushIssue(issues, {
      severity: 'error',
      code: 'missing-source',
      title: 'Manca una sorgente',
      description: 'Aggiungi una pompa o un compressore per alimentare il circuito.',
      fixSuggestion: 'Inserisci un componente di alimentazione dalla libreria.',
    });
  }

  if (valves.length === 0) {
    pushIssue(issues, {
      severity: 'error',
      code: 'missing-valve',
      title: 'Manca un distributore',
      description: 'Il circuito non puo essere comandato senza almeno una valvola distributrice.',
      fixSuggestion: 'Aggiungi una 3/2, 4/2 o 5/2 in base all attuatore.',
    });
  }

  if (actuators.length === 0) {
    pushIssue(issues, {
      severity: 'warning',
      code: 'missing-actuator',
      title: 'Nessun utilizzatore presente',
      description: 'Lo schema non ha ancora un cilindro o un motore da azionare.',
      fixSuggestion: 'Inserisci almeno un utilizzatore per completare la catena.',
    });
  }

  if (sinks.length === 0) {
    pushIssue(issues, {
      severity: 'warning',
      code: 'missing-sink',
      title: 'Manca ritorno o scarico',
      description: 'Serve un ritorno coerente per chiudere la catena minima di simulazione.',
      fixSuggestion: domain === 'hydraulic' ? 'Aggiungi un serbatoio.' : 'Aggiungi uno scarico atmosfera.',
    });
  }

  scoped.forEach(({ node, component }) => {
    const fluidPorts = component?.ports.filter((port) => port.kind === 'fluid') ?? [];
    const connectedCount = fluidPorts.filter((port) =>
      connectedPortKeys.has(toPortKey(node.instanceId, port.id)),
    ).length;

    if (fluidPorts.length > 0 && connectedCount === 0) {
      pushIssue(issues, {
        severity: 'warning',
        code: 'isolated-node',
        title: `${node.label} e isolato`,
        description: 'Il componente e presente nel canvas ma non e collegato a nessuna rete.',
        fixSuggestion: 'Collega almeno una porta del componente.',
        entityRef: { type: 'node', id: node.instanceId },
      });
    }

    fluidPorts
      .filter((port) => !connectedPortKeys.has(toPortKey(node.instanceId, port.id)))
      .forEach((port) => {
        pushIssue(issues, {
          severity: component.simBehavior.kind === 'display' || component.simBehavior.kind === 'instrument' ? 'info' : 'warning',
          code: 'open-port',
          title: `Porta aperta ${port.label}`,
          description: `${node.label} ha la porta ${port.label} ancora non collegata.`,
          fixSuggestion: 'Chiudi la porta con una rete compatibile o usa un componente appropriato.',
          entityRef: { type: 'node', id: node.instanceId },
        });
      });

    const drivePort = component?.ports.find((port) => port.kind === 'mechanical');
    if (drivePort && component.simBehavior.kind === 'source') {
      const driveConnected = connections.some(
        (connection) =>
          (connection.from.nodeId === node.instanceId && connection.from.portId === drivePort.id) ||
          (connection.to.nodeId === node.instanceId && connection.to.portId === drivePort.id),
      );

      if (!driveConnected) {
        pushIssue(issues, {
          severity: 'info',
          code: 'missing-drive',
          title: `Albero non trascinato per ${node.label}`,
          description: 'La sorgente non ha ancora un collegamento meccanico di trascinamento.',
          fixSuggestion: 'Collega un motore primo oppure lascia il nodo come sorgente ideale.',
          entityRef: { type: 'node', id: node.instanceId },
        });
      }
    }
  });

  nets
    .filter((net) => net.domain === domain)
    .forEach((net) => {
      if ((net.connectedPorts?.length ?? 0) < 2) {
        pushIssue(issues, {
          severity: 'warning',
          code: 'underspecified-net',
          title: net.label ? `Rete incompleta: ${net.label}` : 'Rete incompleta',
          description: 'La rete non collega ancora almeno due punti del circuito.',
          fixSuggestion: 'Aggiungi un altro ramo oppure elimina il segmento incompleto.',
          entityRef: { type: 'net', id: net.id },
        });
      }
    });

  const validation = validateCircuit(nodes, connections, domain);
  if (!validation.valid) {
    validation.warnings.forEach((warning) => {
      pushIssue(issues, {
        severity: 'error',
        code: 'validation',
        title: 'Schema non simulabile',
        description: warning,
        fixSuggestion: 'Controlla alimentazione, distributore, utilizzatore e ritorno.',
      });
    });
  } else {
    pushIssue(issues, {
      severity: 'success',
      code: 'validation',
      title: 'Schema simulabile',
      description: 'La catena minima del circuito e coerente per l avvio della simulazione logica.',
      fixSuggestion: 'Puoi avviare la simulazione o creare scenari piu avanzati.',
    });
  }

  return {
    issues: sortBySeverity(issues),
    summary: {
      total: issues.length,
      errors: issues.filter((issue) => issue.severity === 'error').length,
      warnings: issues.filter((issue) => issue.severity === 'warning').length,
      infos: issues.filter((issue) => issue.severity === 'info').length,
      nets: nets.filter((net) => net.domain === domain).length,
    },
  };
};
