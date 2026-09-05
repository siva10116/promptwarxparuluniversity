import { jsPDF } from 'jspdf';

export function exportProjectPDF(project) {
  const doc = new jsPDF();
  const margin = 20;
  let y = 20;

  // Title Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 42, 69); // #0F2A45 Blueprint dark
  doc.text('DRAFTING TABLE AI - CAPSTONE PROJECT BLUEPRINT', margin, y);
  
  y += 8;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(143, 180, 209);
  doc.text(`Generated on ${new Date().toLocaleDateString()} | Production Report`, margin, y);
  
  y += 10;
  doc.setLineWidth(0.5);
  doc.setDrawColor(62, 110, 158);
  doc.line(margin, y, 190, y);

  y += 12;

  // Project Title
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  const titleLines = doc.splitTextToSize(project.title, 170);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 7 + 2;

  // Tagline
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(71, 85, 105);
  const taglineLines = doc.splitTextToSize(`"${project.tagline}"`, 170);
  doc.text(taglineLines, margin, y);
  y += taglineLines.length * 5 + 6;

  // Blueprint Metadata Block
  doc.setFillColor(240, 246, 252);
  doc.rect(margin, y, 170, 22, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(18, 50, 79);
  
  const domainText = project.domain || 'Engineering';
  const difficultyText = project.difficulty || 'Intermediate';
  const durationText = project.duration || project.timeline || '3–4 months';
  const teamText = project.teamSize || '2–3 people';

  doc.text(`Domain: ${domainText}`, margin + 5, y + 8);
  doc.text(`Difficulty: ${difficultyText}`, margin + 65, y + 8);
  doc.text(`Duration: ${durationText}`, margin + 120, y + 8);
  doc.text(`Team Size: ${teamText}`, margin + 5, y + 16);
  doc.text(`Tech: ${(project.techStack || []).slice(0, 4).join(', ')}`, margin + 65, y + 16);

  y += 30;

  // Section 1: Problem Statement
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 106, 61); // Blueprint orange
  doc.text('1. PROBLEM STATEMENT', margin, y);
  y += 6;
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);
  const probLines = doc.splitTextToSize(project.problem || project.problemStatement || '', 170);
  doc.text(probLines, margin, y);
  y += probLines.length * 5 + 8;

  // Section 2: Core Features
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 106, 61);
  doc.text('2. CORE FEATURES & CAPABILITIES', margin, y);
  y += 6;
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  (project.features || project.keyFeatures || []).forEach((feat) => {
    const fLines = doc.splitTextToSize(`• ${feat}`, 165);
    doc.text(fLines, margin + 4, y);
    y += fLines.length * 5 + 1.5;
  });

  y += 6;
  if (y > 230) {
    doc.addPage();
    y = 20;
  }

  // Section 3: Roadmap
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 106, 61);
  doc.text('3. BUILD ROADMAP', margin, y);
  y += 6;
  (project.roadmap || []).forEach((step, idx) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(`Step ${idx + 1}: ${step.phase}`, margin + 4, y);
    y += 4.5;
    doc.setFont('helvetica', 'normal');
    doc.text(`   - ${step.detail}`, margin + 6, y);
    y += 5.5;
  });

  // Footer on all pages
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(143, 180, 209);
    doc.text(`Page ${i} of ${pageCount} - Drafting Table Capstone Blueprint`, 105, 285, { align: 'center' });
  }

  const filename = `${(project.title || 'project').toLowerCase().replace(/[^a-z0-9]/g, '_')}_blueprint.pdf`;
  doc.save(filename);
}

export function exportProjectMarkdown(project) {
  const mdContent = `# Project Blueprint: ${project.title}

> **Tagline**: ${project.tagline}  
> **Domain**: ${project.domain} | **Difficulty**: ${project.difficulty} | **Duration**: ${project.duration || project.timeline} | **Team**: ${project.teamSize}

---

## 1. Problem Statement
${project.problem || project.problemStatement}

## 2. Core Features
${(project.features || project.keyFeatures || []).map(f => `- ${f}`).join('\n')}

## 3. Tech Stack
${(project.techStack || []).map(t => `- **${t}**`).join('\n')}

## 4. Build Roadmap
${(project.roadmap || []).map((r, i) => `### ${i + 1}. ${r.phase}\n${r.detail}`).join('\n\n')}

${project.whyFit ? `## 5. Why This Fits You\n${project.whyFit}\n` : ''}

${project.architectureDiagram ? `## 6. System Architecture Diagram\n\`\`\`mermaid\n${project.architectureDiagram}\n\`\`\`\n` : ''}

---
*Generated via Drafting Table AI Mentor*
`;

  const blob = new Blob([mdContent], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(project.title || 'project').toLowerCase().replace(/[^a-z0-9]/g, '_')}_blueprint.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
