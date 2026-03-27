import { createInitialNodeState, getComponentDefinition } from '../data/fluidPowerCatalog';

export const FLUID_POWER_PROJECT_VERSION = 1;
export const FLUID_POWER_PROJECT_STORAGE_KEY = 'thermohub:fluid-power:project';

const cloneValue = (value) =>
  typeof structuredClone === 'function'
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));

const createProjectId = () =>
  `fluid-project-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const createIsoDate = () => new Date().toISOString();

const normalizeArray = (value) =>
  Array.isArray(value) ? value.filter(Boolean) : typeof value === 'string' && value.trim() ? [value.trim()] : [];

export const createProjectMeta = () => ({
  id: createProjectId(),
  name: 'Fluid Power Project',
  mode: 'didactic',
  units: 'metric',
  version: FLUID_POWER_PROJECT_VERSION,
  author: 'ThermoHub',
  tags: ['fluid-power'],
  createdAt: createIsoDate(),
  updatedAt: createIsoDate(),
});

export const touchProjectMeta = (meta) => ({
  ...meta,
  updatedAt: createIsoDate(),
});

export const createDraftNodePayload = (componentId, instanceId, x, y, label) => {
  const component = getComponentDefinition(componentId);
  if (!component) {
    return null;
  }

  return {
    instanceId,
    componentId,
    libraryId: componentId,
    vendorRef: '',
    domain: component.domain,
    x,
    y,
    rotation: 0,
    label,
    annotation: '',
    faults: [],
    parameters: {},
    locked: false,
    state: createInitialNodeState(component),
  };
};

const sanitizeNet = (net) => ({
  id: net.id,
  domain: net.domain,
  kind: net.kind,
  medium: net.medium ?? (net.domain === 'hydraulic' ? 'oil' : 'air'),
  pressureClass: net.pressureClass ?? 'standard',
  signalType: net.signalType ?? (net.kind === 'mechanical' ? 'mechanical' : 'process'),
  label: net.label ?? '',
  segmentIds: Array.isArray(net.segmentIds) ? net.segmentIds : [],
  connectedPorts: Array.isArray(net.connectedPorts) ? net.connectedPorts : [],
});

export const sanitizeWorkspaceForDocument = (workspace) => ({
  nodes: cloneValue(workspace.nodes ?? []),
  connections: cloneValue(workspace.connections ?? []),
  nets: cloneValue((workspace.nets ?? []).map(sanitizeNet)),
  snapshot: cloneValue(workspace.snapshot ?? {}),
  lastRun: cloneValue(workspace.lastRun ?? null),
  baselineRun: cloneValue(workspace.baselineRun ?? null),
  scenarioId: workspace.scenarioId ?? 'startup-sequence',
  timelineStep: typeof workspace.timelineStep === 'number' ? workspace.timelineStep : 0,
  message: workspace.message ?? '',
  selectedEntity: cloneValue(workspace.selectedEntity ?? null),
  pendingPort: null,
});

export const buildProjectDocument = (projectMeta, workspaces) => ({
  type: 'thermohub-fluid-power-project',
  ...touchProjectMeta(projectMeta),
  tags: normalizeArray(projectMeta.tags),
  workspaces: {
    hydraulic: sanitizeWorkspaceForDocument(workspaces.hydraulic),
    pneumatic: sanitizeWorkspaceForDocument(workspaces.pneumatic),
  },
});

const hydrateNode = (node) => {
  const component = getComponentDefinition(node.componentId);
  if (!component) {
    return null;
  }

  return {
    instanceId: node.instanceId,
    componentId: node.componentId,
    libraryId: node.libraryId ?? node.componentId,
    vendorRef: node.vendorRef ?? '',
    domain: node.domain ?? component.domain,
    x: typeof node.x === 'number' ? node.x : 48,
    y: typeof node.y === 'number' ? node.y : 48,
    rotation: typeof node.rotation === 'number' ? node.rotation : 0,
    label: node.label ?? component.label,
    annotation: node.annotation ?? '',
    faults: Array.isArray(node.faults) ? node.faults : [],
    parameters: typeof node.parameters === 'object' && node.parameters ? node.parameters : {},
    locked: Boolean(node.locked),
    state: node.state ?? createInitialNodeState(component),
  };
};

const hydrateWorkspace = (workspace, createWorkspace) => {
  const base = createWorkspace();
  const nodes = (workspace?.nodes ?? []).map(hydrateNode).filter(Boolean);
  const connections = Array.isArray(workspace?.connections) ? workspace.connections : [];

  return {
    ...base,
    nodes,
    connections,
    nets: Array.isArray(workspace?.nets) ? workspace.nets.map(sanitizeNet) : [],
    snapshot: workspace?.snapshot ?? base.snapshot,
    lastRun: workspace?.lastRun ?? null,
    baselineRun: workspace?.baselineRun ?? null,
    scenarioId: workspace?.scenarioId ?? base.scenarioId,
    timelineStep: typeof workspace?.timelineStep === 'number' ? workspace.timelineStep : base.timelineStep,
    message: workspace?.message ?? base.message,
    selectedEntity: workspace?.selectedEntity ?? null,
    pendingPort: null,
  };
};

export const hydrateProjectDocument = (rawDocument, createWorkspace) => {
  const document =
    typeof rawDocument === 'string' ? JSON.parse(rawDocument) : rawDocument;

  if (!document || document.type !== 'thermohub-fluid-power-project') {
    throw new Error('Formato progetto non valido.');
  }

  const meta = {
    id: document.id ?? createProjectId(),
    name: document.name ?? 'Fluid Power Project',
    mode: document.mode === 'engineering' ? 'engineering' : 'didactic',
    units: document.units ?? 'metric',
    version: document.version ?? FLUID_POWER_PROJECT_VERSION,
    author: document.author ?? 'ThermoHub',
    tags: normalizeArray(document.tags),
    createdAt: document.createdAt ?? createIsoDate(),
    updatedAt: document.updatedAt ?? createIsoDate(),
  };

  return {
    meta,
    workspaces: {
      hydraulic: hydrateWorkspace(document.workspaces?.hydraulic, createWorkspace),
      pneumatic: hydrateWorkspace(document.workspaces?.pneumatic, createWorkspace),
    },
  };
};

export const serializeProjectDocument = (projectMeta, workspaces) =>
  JSON.stringify(buildProjectDocument(projectMeta, workspaces), null, 2);

export const buildBillOfMaterials = (workspace) => {
  const counts = new Map();

  (workspace?.nodes ?? []).forEach((node) => {
    const component = getComponentDefinition(node.componentId);
    if (!component) {
      return;
    }

    const key = component.id;
    const current = counts.get(key) ?? {
      componentId: component.id,
      label: component.label,
      category: component.category,
      domain: component.domain,
      quantity: 0,
    };
    current.quantity += 1;
    counts.set(key, current);
  });

  return [...counts.values()].sort((first, second) =>
    first.category === second.category
      ? first.label.localeCompare(second.label, 'it')
      : first.category.localeCompare(second.category, 'it'),
  );
};

const createTemplateConnection = (id, domain, kind, netId, from, to) => ({
  id,
  netId,
  domain,
  kind,
  from,
  to,
  pathPoints: [],
});

const createTemplateNet = (id, domain, kind, label, segmentIds, connectedPorts) => ({
  id,
  domain,
  kind,
  medium: domain === 'hydraulic' ? 'oil' : 'air',
  pressureClass: 'standard',
  signalType: kind === 'mechanical' ? 'mechanical' : 'process',
  label,
  segmentIds,
  connectedPorts,
});

export const getFluidPowerTemplates = () => [
  {
    id: 'hydraulic-single-acting',
    domain: 'hydraulic',
    label: 'Cilindro semplice effetto',
    description: 'Pompa, distributore 3/2, cilindro semplice effetto e serbatoio.',
  },
  {
    id: 'hydraulic-double-acting',
    domain: 'hydraulic',
    label: 'Cilindro doppio effetto',
    description: 'Pompa, distributore 4/2, cilindro doppio effetto e serbatoio.',
  },
  {
    id: 'pneumatic-frl-chain',
    domain: 'pneumatic',
    label: 'Catena pneumatica FRL',
    description: 'Compressore, FRL, 5/2 e cilindro doppio effetto con scarico.',
  },
];

export const createTemplateWorkspace = (templateId, createWorkspace) => {
  const workspace = createWorkspace();

  if (templateId === 'hydraulic-single-acting') {
    workspace.nodes = [
      createDraftNodePayload('hydraulic-pump', 'tpl-h-pump', 72, 240, 'Pompa idraulica 1'),
      createDraftNodePayload('hydraulic-valve-3-2', 'tpl-h-valve', 332, 224, 'Valvola 3/2 1'),
      createDraftNodePayload('hydraulic-single-cylinder', 'tpl-h-cylinder', 652, 220, 'Cilindro semplice 1'),
      createDraftNodePayload('hydraulic-reservoir', 'tpl-h-tank', 324, 468, 'Serbatoio 1'),
    ].filter(Boolean);

    workspace.connections = [
      createTemplateConnection('tpl-h-c1', 'hydraulic', 'fluid', 'tpl-h-net-1', { nodeId: 'tpl-h-pump', portId: 'P' }, { nodeId: 'tpl-h-valve', portId: 'P' }),
      createTemplateConnection('tpl-h-c2', 'hydraulic', 'fluid', 'tpl-h-net-2', { nodeId: 'tpl-h-valve', portId: 'A' }, { nodeId: 'tpl-h-cylinder', portId: 'A' }),
      createTemplateConnection('tpl-h-c3', 'hydraulic', 'fluid', 'tpl-h-net-3', { nodeId: 'tpl-h-valve', portId: 'R' }, { nodeId: 'tpl-h-tank', portId: 'IN' }),
      createTemplateConnection('tpl-h-c4', 'hydraulic', 'fluid', 'tpl-h-net-4', { nodeId: 'tpl-h-pump', portId: 'S' }, { nodeId: 'tpl-h-tank', portId: 'OUT' }),
    ];

    workspace.nets = [
      createTemplateNet('tpl-h-net-1', 'hydraulic', 'fluid', 'Mandata P', ['tpl-h-c1'], [{ nodeId: 'tpl-h-pump', portId: 'P' }, { nodeId: 'tpl-h-valve', portId: 'P' }]),
      createTemplateNet('tpl-h-net-2', 'hydraulic', 'fluid', 'Linea lavoro A', ['tpl-h-c2'], [{ nodeId: 'tpl-h-valve', portId: 'A' }, { nodeId: 'tpl-h-cylinder', portId: 'A' }]),
      createTemplateNet('tpl-h-net-3', 'hydraulic', 'fluid', 'Ritorno T', ['tpl-h-c3'], [{ nodeId: 'tpl-h-valve', portId: 'R' }, { nodeId: 'tpl-h-tank', portId: 'IN' }]),
      createTemplateNet('tpl-h-net-4', 'hydraulic', 'fluid', 'Aspirazione S', ['tpl-h-c4'], [{ nodeId: 'tpl-h-pump', portId: 'S' }, { nodeId: 'tpl-h-tank', portId: 'OUT' }]),
    ];
    workspace.message = 'Template idraulico a semplice effetto caricato.';
  }

  if (templateId === 'hydraulic-double-acting') {
    workspace.nodes = [
      createDraftNodePayload('hydraulic-pump', 'tpl-hd-pump', 60, 248, 'Pompa idraulica 1'),
      createDraftNodePayload('hydraulic-valve-4-2', 'tpl-hd-valve', 318, 220, 'Valvola 4/2 1'),
      createDraftNodePayload('hydraulic-double-cylinder', 'tpl-hd-cylinder', 690, 220, 'Cilindro doppio 1'),
      createDraftNodePayload('hydraulic-reservoir', 'tpl-hd-tank', 318, 500, 'Serbatoio 1'),
    ].filter(Boolean);

    workspace.connections = [
      createTemplateConnection('tpl-hd-c1', 'hydraulic', 'fluid', 'tpl-hd-net-1', { nodeId: 'tpl-hd-pump', portId: 'P' }, { nodeId: 'tpl-hd-valve', portId: 'P' }),
      createTemplateConnection('tpl-hd-c2', 'hydraulic', 'fluid', 'tpl-hd-net-2', { nodeId: 'tpl-hd-valve', portId: 'A' }, { nodeId: 'tpl-hd-cylinder', portId: 'A' }),
      createTemplateConnection('tpl-hd-c3', 'hydraulic', 'fluid', 'tpl-hd-net-3', { nodeId: 'tpl-hd-valve', portId: 'B' }, { nodeId: 'tpl-hd-cylinder', portId: 'B' }),
      createTemplateConnection('tpl-hd-c4', 'hydraulic', 'fluid', 'tpl-hd-net-4', { nodeId: 'tpl-hd-valve', portId: 'T' }, { nodeId: 'tpl-hd-tank', portId: 'IN' }),
      createTemplateConnection('tpl-hd-c5', 'hydraulic', 'fluid', 'tpl-hd-net-5', { nodeId: 'tpl-hd-pump', portId: 'S' }, { nodeId: 'tpl-hd-tank', portId: 'OUT' }),
    ];

    workspace.nets = [
      createTemplateNet('tpl-hd-net-1', 'hydraulic', 'fluid', 'Mandata P', ['tpl-hd-c1'], [{ nodeId: 'tpl-hd-pump', portId: 'P' }, { nodeId: 'tpl-hd-valve', portId: 'P' }]),
      createTemplateNet('tpl-hd-net-2', 'hydraulic', 'fluid', 'Camera A', ['tpl-hd-c2'], [{ nodeId: 'tpl-hd-valve', portId: 'A' }, { nodeId: 'tpl-hd-cylinder', portId: 'A' }]),
      createTemplateNet('tpl-hd-net-3', 'hydraulic', 'fluid', 'Camera B', ['tpl-hd-c3'], [{ nodeId: 'tpl-hd-valve', portId: 'B' }, { nodeId: 'tpl-hd-cylinder', portId: 'B' }]),
      createTemplateNet('tpl-hd-net-4', 'hydraulic', 'fluid', 'Ritorno T', ['tpl-hd-c4'], [{ nodeId: 'tpl-hd-valve', portId: 'T' }, { nodeId: 'tpl-hd-tank', portId: 'IN' }]),
      createTemplateNet('tpl-hd-net-5', 'hydraulic', 'fluid', 'Aspirazione S', ['tpl-hd-c5'], [{ nodeId: 'tpl-hd-pump', portId: 'S' }, { nodeId: 'tpl-hd-tank', portId: 'OUT' }]),
    ];
    workspace.message = 'Template idraulico a doppio effetto caricato.';
  }

  if (templateId === 'pneumatic-frl-chain') {
    workspace.nodes = [
      createDraftNodePayload('pneumatic-compressor', 'tpl-p-comp', 44, 248, 'Compressore 1'),
      createDraftNodePayload('pneumatic-frl', 'tpl-p-frl', 252, 260, 'FRL 1'),
      createDraftNodePayload('pneumatic-valve-5-2', 'tpl-p-valve', 498, 220, 'Valvola 5/2 1'),
      createDraftNodePayload('pneumatic-double-cylinder', 'tpl-p-cylinder', 828, 220, 'Cilindro doppio 1'),
      createDraftNodePayload('pneumatic-exhaust', 'tpl-p-exhaust', 512, 492, 'Scarico 1'),
    ].filter(Boolean);

    workspace.connections = [
      createTemplateConnection('tpl-p-c1', 'pneumatic', 'fluid', 'tpl-p-net-1', { nodeId: 'tpl-p-comp', portId: 'P' }, { nodeId: 'tpl-p-frl', portId: 'IN' }),
      createTemplateConnection('tpl-p-c2', 'pneumatic', 'fluid', 'tpl-p-net-2', { nodeId: 'tpl-p-frl', portId: 'OUT' }, { nodeId: 'tpl-p-valve', portId: 'P' }),
      createTemplateConnection('tpl-p-c3', 'pneumatic', 'fluid', 'tpl-p-net-3', { nodeId: 'tpl-p-valve', portId: 'A' }, { nodeId: 'tpl-p-cylinder', portId: 'A' }),
      createTemplateConnection('tpl-p-c4', 'pneumatic', 'fluid', 'tpl-p-net-4', { nodeId: 'tpl-p-valve', portId: 'B' }, { nodeId: 'tpl-p-cylinder', portId: 'B' }),
      createTemplateConnection('tpl-p-c5', 'pneumatic', 'fluid', 'tpl-p-net-5', { nodeId: 'tpl-p-valve', portId: 'R1' }, { nodeId: 'tpl-p-exhaust', portId: 'R' }),
      createTemplateConnection('tpl-p-c6', 'pneumatic', 'fluid', 'tpl-p-net-5', { nodeId: 'tpl-p-valve', portId: 'R2' }, { nodeId: 'tpl-p-exhaust', portId: 'R' }),
    ];

    workspace.nets = [
      createTemplateNet('tpl-p-net-1', 'pneumatic', 'fluid', 'Mandata compressore', ['tpl-p-c1'], [{ nodeId: 'tpl-p-comp', portId: 'P' }, { nodeId: 'tpl-p-frl', portId: 'IN' }]),
      createTemplateNet('tpl-p-net-2', 'pneumatic', 'fluid', 'Linea servizio P', ['tpl-p-c2'], [{ nodeId: 'tpl-p-frl', portId: 'OUT' }, { nodeId: 'tpl-p-valve', portId: 'P' }]),
      createTemplateNet('tpl-p-net-3', 'pneumatic', 'fluid', 'Camera A', ['tpl-p-c3'], [{ nodeId: 'tpl-p-valve', portId: 'A' }, { nodeId: 'tpl-p-cylinder', portId: 'A' }]),
      createTemplateNet('tpl-p-net-4', 'pneumatic', 'fluid', 'Camera B', ['tpl-p-c4'], [{ nodeId: 'tpl-p-valve', portId: 'B' }, { nodeId: 'tpl-p-cylinder', portId: 'B' }]),
      createTemplateNet('tpl-p-net-5', 'pneumatic', 'fluid', 'Scarico R', ['tpl-p-c5', 'tpl-p-c6'], [{ nodeId: 'tpl-p-valve', portId: 'R1' }, { nodeId: 'tpl-p-valve', portId: 'R2' }, { nodeId: 'tpl-p-exhaust', portId: 'R' }]),
    ];
    workspace.message = 'Template pneumatico con gruppo FRL caricato.';
  }

  return workspace;
};
