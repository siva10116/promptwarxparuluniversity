import { jsPDF } from 'jspdf';

export function exportProjectPDF(project) {
  const doc = new jsPDF();
  const margin = 20;
  let y = 20;

  // Title & Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(30, 41, 59); // Slate-800
  doc.text('PROJECT SYNOPSIS & PROPOSAL REPORT', margin, y);
  
  y += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated via ProjectSpark AI Mentor | Date: ${new Date().toLocaleDateString()}`, margin, y);
  
  y += 12;
  doc.setLineWidth(0.5);
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, 190, y);

  y += 12;

  // Project Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  const titleLines = doc.splitTextToSize(project.title, 170);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 8;

  // Tagline
  doc.setFontSize(11);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(71, 85, 105);
  const taglineLines = doc.splitTextToSize(project.tagline, 170);
  doc.text(taglineLines, margin, y);
  y += taglineLines.length * 6 + 6;

  // Key Metadata Table Box
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y, 170, 26, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  
  doc.text(`Domain: ${project.domain.toUpperCase()}`, margin + 5, y + 8);
  doc.text(`Difficulty: ${project.difficulty}`, margin + 65, y + 8);
  doc.text(`Team Size: ${project.teamSize}`, margin + 120, y + 8);
  
  doc.text(`Timeline: ${project.timeline}`, margin + 5, y + 18);
  doc.text(`Innovation Score: ${project.innovationScore}/100`, margin + 65, y + 18);
  doc.text(`Tech Stack: ${project.techStack.join(', ')}`, margin + 120, y + 18, { maxWidth: 45 });

  y += 34;

  // Section 1: Problem Statement
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('1. Problem Statement & Background', margin, y);
  y += 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const probLines = doc.splitTextToSize(project.problemStatement, 170);
  doc.text(probLines, margin, y);
  y += probLines.length * 5 + 8;

  // Section 2: Solution Overview
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('2. Proposed Solution Architecture', margin, y);
  y += 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const solLines = doc.splitTextToSize(project.solutionOverview, 170);
  doc.text(solLines, margin, y);
  y += solLines.length * 5 + 8;

  // Page Break Check
  if (y > 230) {
    doc.addPage();
    y = 20;
  }

  // Section 3: Key Features
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('3. Core Technical Features', margin, y);
  y += 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  project.keyFeatures.forEach((feat) => {
    const featLines = doc.splitTextToSize(`• ${feat}`, 165);
    doc.text(featLines, margin + 4, y);
    y += featLines.length * 5 + 2;
  });

  y += 6;
  if (y > 230) {
    doc.addPage();
    y = 20;
  }

  // Section 4: Implementation Roadmap
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('4. Implementation Roadmap & Milestones', margin, y);
  y += 6;
  project.roadmap.forEach((phase) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(`${phase.phase} (${phase.duration}): ${phase.title}`, margin + 4, y);
    y += 5;
    doc.setFont('helvetica', 'normal');
    phase.tasks.forEach((t) => {
      doc.text(`  - ${t}`, margin + 8, y);
      y += 4.5;
    });
    y += 2;
  });

  // Footer on all pages
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${i} of ${pageCount} - Confidential Project Proposal - ProjectSpark AI`, 105, 285, { align: 'center' });
  }

  // Save PDF
  const filename = `${project.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_synopsis.pdf`;
  doc.save(filename);
}

export function exportProjectMarkdown(project) {
  const mdContent = `# Project Proposal: ${project.title}

> **Tagline**: ${project.tagline}  
> **Domain**: ${project.domain} | **Difficulty**: ${project.difficulty} | **Timeline**: ${project.timeline} | **Team Size**: ${project.teamSize}  
> **Innovation Score**: ${project.innovationScore}/100

---

## 1. Problem Statement
${project.problemStatement}

## 2. Proposed Solution Overview
${project.solutionOverview}

## 3. Recommended Tech Stack
${project.techStack.map(t => `- **${t}**`).join('\n')}

## 4. Key Core Features
${project.keyFeatures.map(f => `- ${f}`).join('\n')}

## 5. System Architecture Diagram (Mermaid)
\`\`\`mermaid
${project.architectureDiagram}
\`\`\`

## 6. Implementation Roadmap
${project.roadmap.map(r => `### ${r.phase}: ${r.title} (${r.duration})\n${r.tasks.map(t => `- [ ] ${t}`).join('\n')}`).join('\n\n')}

## 7. Sample Viva Defense Questions & Answers
${project.vivaQuestions.map(v => `### Q: ${v.question}\n**Category**: ${v.category}\n**Answer**: ${v.answer}\n`).join('\n')}

---
*Report generated via ProjectSpark AI & Mentor Platform*
`;

  const blob = new Blob([mdContent], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_synopsis.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
