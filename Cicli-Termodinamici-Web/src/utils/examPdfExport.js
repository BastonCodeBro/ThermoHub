import { THERMOHUB_AUTHOR, addPdfHeader, applyPdfFooters } from './pdfBranding';

let jsPdfPromise = null;
let html2CanvasPromise = null;

const getJsPDF = async () => {
  if (!jsPdfPromise) {
    jsPdfPromise = import('jspdf').then((module) => module.jsPDF);
  }
  return jsPdfPromise;
};

const getHtml2Canvas = async () => {
  if (!html2CanvasPromise) {
    html2CanvasPromise = import('html2canvas').then((module) => module.default);
  }
  return html2CanvasPromise;
};

const captureElement = async (html2canvas, ref, name) => {
  if (!ref?.current) {
    return null;
  }

  try {
    return await html2canvas(ref.current, {
      backgroundColor: '#07111F',
      scale: 2.5,
      useCORS: true,
      logging: false,
    });
  } catch (error) {
    console.warn(`Failed to capture ${name}:`, error);
    return null;
  }
};

const wrapParagraph = (pdf, text, width) => pdf.splitTextToSize(text, width);

export const exportExamToPDF = async ({
  exam,
  diagramMeta = null,
  summaryRef,
  diagramRef,
}) => {
  const [jsPDF, html2canvas] = await Promise.all([getJsPDF(), getHtml2Canvas()]);
  const [summaryCanvas, diagramCanvas] = await Promise.all([
    captureElement(html2canvas, summaryRef, 'summary'),
    captureElement(html2canvas, diagramRef, 'diagram'),
  ]);

  const pdf = new jsPDF('p', 'mm', 'a4');
  const margin = 14;
  const contentWidth = 182;
  const accentColor = '#F59E0B';
  let y = addPdfHeader(pdf, {
    title: exam.shortTitle,
    subtitle: exam.headline,
    accentColor,
    label: 'Esami di Stato',
  });

  const newPage = () => {
    pdf.addPage();
    y = addPdfHeader(pdf, {
      title: exam.shortTitle,
      subtitle: exam.headline,
      accentColor,
      label: 'Esami di Stato',
    });
  };

  const ensureSpace = (needed) => {
    if (y + needed > 280) {
      newPage();
    }
  };

  const addInfoBand = () => {
    ensureSpace(16);
    pdf.setFillColor(248, 250, 252);
    pdf.roundedRect(margin, y, contentWidth, 12, 3.5, 3.5, 'F');
    pdf.setDrawColor(226, 232, 240);
    pdf.roundedRect(margin, y, contentWidth, 12, 3.5, 3.5, 'S');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8.5);
    pdf.setTextColor(245, 158, 11);
    pdf.text(`Traccia + svolgimento completo | ${exam.code} ${exam.year}`, margin + 4, y + 4.8);

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(71, 85, 105);
    pdf.text(`Generato il ${new Date().toLocaleDateString('it-IT')} da ${THERMOHUB_AUTHOR}`, margin + 4, y + 8.9);
    y += 16;
  };

  const addSectionTitle = (title, subtitle) => {
    ensureSpace(subtitle ? 16 : 10);
    pdf.setDrawColor(245, 158, 11);
    pdf.setLineWidth(0.8);
    pdf.line(margin, y + 1.5, margin + 16, y + 1.5);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(13);
    pdf.setTextColor(15, 23, 42);
    pdf.text(title, margin, y + 8);

    if (subtitle) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.5);
      pdf.setTextColor(100, 116, 139);
      pdf.text(subtitle, margin, y + 13);
      y += 18;
      return;
    }

    y += 12;
  };

  const addParagraphs = (paragraphs) => {
    paragraphs.forEach((paragraph) => {
      const lines = wrapParagraph(pdf, paragraph, contentWidth - 8);
      const boxHeight = Math.max(10, lines.length * 4.8 + 5);
      ensureSpace(boxHeight + 2);

      pdf.setFillColor(248, 250, 252);
      pdf.roundedRect(margin, y, contentWidth, boxHeight, 3, 3, 'F');
      pdf.setDrawColor(226, 232, 240);
      pdf.roundedRect(margin, y, contentWidth, boxHeight, 3, 3, 'S');

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9.6);
      pdf.setTextColor(30, 41, 59);
      pdf.text(lines, margin + 4, y + 5.5);
      y += boxHeight + 3;
    });
  };

  const addBulletList = (items) => {
    items.forEach((item, index) => {
      const bulletText = `${index + 1}. ${item}`;
      const lines = wrapParagraph(pdf, bulletText, contentWidth - 14);
      const height = Math.max(9, lines.length * 4.6 + 4);
      ensureSpace(height + 2);

      pdf.setFillColor(255, 251, 235);
      pdf.roundedRect(margin, y, contentWidth, height, 3, 3, 'F');
      pdf.setDrawColor(251, 191, 36);
      pdf.setLineWidth(0.25);
      pdf.line(margin + 3.5, y + 2, margin + 3.5, y + height - 2);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9.4);
      pdf.setTextColor(51, 65, 85);
      pdf.text(lines, margin + 7, y + 5.2);
      y += height + 2.4;
    });
  };

  const addCanvasBlock = (title, canvas, maxHeight = 86) => {
    if (!canvas) {
      return;
    }

    const ratio = canvas.height / canvas.width;
    const targetWidth = contentWidth;
    const targetHeight = Math.min(maxHeight, targetWidth * ratio);
    ensureSpace(targetHeight + 16);

    addSectionTitle(title);
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', margin, y, targetWidth, targetHeight, undefined, 'FAST');
    y += targetHeight + 5;
  };

  const addSteps = () => {
    exam.firstPart.steps.forEach((step) => {
      const bodyLines = step.body.flatMap((paragraph) => wrapParagraph(pdf, paragraph, contentWidth - 14));
      const height = Math.max(18, bodyLines.length * 4.6 + 12);
      ensureSpace(height + 3);

      pdf.setFillColor(247, 250, 252);
      pdf.roundedRect(margin, y, contentWidth, height, 3.5, 3.5, 'F');
      pdf.setDrawColor(56, 189, 248);
      pdf.setLineWidth(0.4);
      pdf.roundedRect(margin, y, contentWidth, height, 3.5, 3.5, 'S');
      pdf.setFillColor(15, 23, 42);
      pdf.rect(margin, y, 4, height, 'F');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10.5);
      pdf.setTextColor(15, 23, 42);
      pdf.text(step.title, margin + 8, y + 6);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9.3);
      pdf.setTextColor(51, 65, 85);
      let localY = y + 11;
      step.body.forEach((paragraph) => {
        const lines = wrapParagraph(pdf, paragraph, contentWidth - 14);
        pdf.text(lines, margin + 8, localY);
        localY += lines.length * 4.6 + 2;
      });

      y += height + 3;
    });
  };

  const addResultsGrid = () => {
    const cardWidth = (contentWidth - 4) / 2;
    const rowHeight = 18;

    exam.firstPart.results.forEach((result, index) => {
      if (index % 2 === 0) {
        ensureSpace(rowHeight + 3);
      }

      const x = margin + (index % 2) * (cardWidth + 4);
      if (index % 2 === 0 && index > 0) {
        y += rowHeight + 3;
      }

      pdf.setFillColor(239, 246, 255);
      pdf.roundedRect(x, y, cardWidth, rowHeight, 3, 3, 'F');
      pdf.setDrawColor(125, 211, 252);
      pdf.roundedRect(x, y, cardWidth, rowHeight, 3, 3, 'S');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(7.9);
      pdf.setTextColor(14, 116, 144);
      pdf.text(pdf.splitTextToSize(result.label.toUpperCase(), cardWidth - 8), x + 4, y + 5.2);

      pdf.setFontSize(10.8);
      pdf.setTextColor(15, 23, 42);
      pdf.text(String(result.value), x + 4, y + 13);
    });

    y += rowHeight + 5;
  };

  const addQuestions = () => {
    exam.selectedQuestions.forEach((question) => {
      const allLines = question.points.flatMap((point, index) => wrapParagraph(pdf, `${index + 1}. ${point}`, contentWidth - 16));
      const height = Math.max(18, allLines.length * 4.5 + 11);
      ensureSpace(height + 3);

      pdf.setFillColor(255, 251, 235);
      pdf.roundedRect(margin, y, contentWidth, height, 3.5, 3.5, 'F');
      pdf.setDrawColor(245, 158, 11);
      pdf.roundedRect(margin, y, contentWidth, height, 3.5, 3.5, 'S');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10.4);
      pdf.setTextColor(120, 53, 15);
      pdf.text(`${question.code}) ${question.title}`, margin + 4, y + 6);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9.1);
      pdf.setTextColor(51, 65, 85);
      let localY = y + 11;
      question.points.forEach((point, index) => {
        const lines = wrapParagraph(pdf, `${index + 1}. ${point}`, contentWidth - 14);
        pdf.text(lines, margin + 4, localY);
        localY += lines.length * 4.5 + 1.5;
      });

      y += height + 3;
    });
  };

  addInfoBand();
  addCanvasBlock('Scheda rapida', summaryCanvas, 54);
  addCanvasBlock(diagramMeta?.title ?? 'Diagramma tecnico', diagramCanvas, 88);

  addSectionTitle('Traccia ministeriale', 'La traccia originale e riportata anche nel PDF svolto.');
  addParagraphs(exam.trace);

  addSectionTitle('Ipotesi di svolgimento', 'Assunzioni operative e dati scelti per guidare il calcolo.');
  addBulletList(exam.assumptions);

  addSectionTitle('Svolgimento dettagliato', 'Passaggi ragionati con sviluppo della prima parte.');
  addSteps();

  addSectionTitle('Risultati finali');
  addResultsGrid();

  addSectionTitle('Schema funzionale essenziale');
  addBulletList(exam.firstPart.schematic);

  addSectionTitle('Quesiti svolti');
  addQuestions();

  applyPdfFooters(pdf, {
    accentColor,
    footerLabel: `ThermoHub | ${THERMOHUB_AUTHOR} | ${exam.shortTitle}`,
  });

  pdf.save(`${exam.shortTitle.replace(/\s+/g, '_')}_ThermoHub_svolto.pdf`);
};
