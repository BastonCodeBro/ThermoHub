export const THERMOHUB_NAME = 'ThermoHub';
export const THERMOHUB_AUTHOR = 'Prof. Ing. Andrea Viola';

export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [56, 189, 248];
};

export const drawThermoHubMark = (pdf, x, y, size = 16, accentColor = '#38BDF8') => {
  const [accentR, accentG, accentB] = hexToRgb(accentColor);
  const amber = [245, 158, 11];

  pdf.setFillColor(7, 17, 31);
  pdf.roundedRect(x, y, size, size, 3.5, 3.5, 'F');
  pdf.setDrawColor(accentR, accentG, accentB);
  pdf.setLineWidth(0.45);
  pdf.roundedRect(x, y, size, size, 3.5, 3.5, 'S');

  pdf.setFillColor(245, 158, 11);
  pdf.circle(x + size * 0.79, y + size * 0.22, size * 0.08, 'F');

  pdf.setDrawColor(accentR, accentG, accentB);
  pdf.setLineWidth(size * 0.08);
  pdf.line(x + size * 0.22, y + size * 0.28, x + size * 0.78, y + size * 0.28);
  pdf.line(x + size * 0.5, y + size * 0.28, x + size * 0.5, y + size * 0.79);

  pdf.setDrawColor(226, 232, 240);
  pdf.setLineWidth(size * 0.06);
  pdf.line(x + size * 0.28, y + size * 0.33, x + size * 0.28, y + size * 0.79);
  pdf.line(x + size * 0.72, y + size * 0.33, x + size * 0.72, y + size * 0.79);
  pdf.line(x + size * 0.28, y + size * 0.56, x + size * 0.72, y + size * 0.56);

  pdf.setDrawColor(...amber);
  pdf.setLineWidth(0.35);
  pdf.line(x + size * 0.82, y + size * 0.18, x + size * 0.92, y + size * 0.08);
};

export const addPdfHeader = (
  pdf,
  {
    title,
    subtitle,
    accentColor = '#38BDF8',
    label = 'Materiale didattico',
    author = THERMOHUB_AUTHOR,
  },
) => {
  const margin = 14;
  const width = 182;
  const [accentR, accentG, accentB] = hexToRgb(accentColor);

  pdf.setFillColor(8, 15, 28);
  pdf.roundedRect(margin, 12, width, 28, 5, 5, 'F');

  pdf.setDrawColor(accentR, accentG, accentB);
  pdf.setLineWidth(0.6);
  pdf.roundedRect(margin, 12, width, 28, 5, 5, 'S');

  pdf.setFillColor(accentR, accentG, accentB);
  pdf.rect(margin + width - 28, 12, 28, 28, 'F');

  drawThermoHubMark(pdf, margin + 4, 16, 14, accentColor);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(accentR, accentG, accentB);
  pdf.text(label.toUpperCase(), margin + 22, 19);

  pdf.setFontSize(18);
  pdf.setTextColor(226, 232, 240);
  pdf.text(title, margin + 22, 27);

  if (subtitle) {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    pdf.setTextColor(148, 163, 184);
    pdf.text(pdf.splitTextToSize(subtitle, 112), margin + 22, 33);
  }

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(7, 17, 31);
  pdf.text(THERMOHUB_NAME, margin + width - 24, 24);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  pdf.text(author.replace('Prof. Ing. ', ''), margin + width - 24, 29.5);

  return 48;
};

export const applyPdfFooters = (
  pdf,
  {
    accentColor = '#38BDF8',
    footerLabel = `${THERMOHUB_NAME} | ${THERMOHUB_AUTHOR}`,
  } = {},
) => {
  const [accentR, accentG, accentB] = hexToRgb(accentColor);
  const pageCount = pdf.getNumberOfPages();

  for (let page = 1; page <= pageCount; page += 1) {
    pdf.setPage(page);
    pdf.setDrawColor(51, 65, 85);
    pdf.setLineWidth(0.25);
    pdf.line(14, 287, 196, 287);

    drawThermoHubMark(pdf, 14, 289, 7.5, accentColor);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184);
    pdf.text(footerLabel, 24, 294);

    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(accentR, accentG, accentB);
    pdf.text(`Pag. ${page}/${pageCount}`, 184, 294, { align: 'right' });
  }
};
