#!/usr/bin/env python3
"""
Gramin Career Setu — Formal Academic Project Specification Document Generator
Conforms exactly to the standardized College/University Academic Project Document
specification format demonstrated in benchmark reference documents:
Cover Page -> Declaration -> Abstract -> Table of Contents -> Chapters 1-8 -> Appendix A.
"""

import os
import sys
import shutil
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY

# High-Contrast Brand Palette
COLOR_PRIMARY = HexColor("#1B4D3E")       # Signature Forest Green
COLOR_PRIMARY_LIGHT = HexColor("#ECFDF5") # Mint / Emerald Wash
COLOR_SECONDARY = HexColor("#047857")     # Emerald Accent
COLOR_AMBER = HexColor("#B45309")         # Warm Amber Accent
COLOR_AMBER_LIGHT = HexColor("#FFFBEB")   # Amber Callout Tint
COLOR_DARK = HexColor("#0F172A")          # Slate 900
COLOR_MUTED = HexColor("#334155")         # Slate 700 (High contrast)
COLOR_LIGHT_MUTED = HexColor("#64748B")   # Slate 500
COLOR_BORDER = HexColor("#CBD5E1")        # Slate 300
COLOR_BORDER_LIGHT = HexColor("#E2E8F0")  # Slate 200
COLOR_BG_CARD = HexColor("#F8FAFC")       # Slate 50
COLOR_WHITE = HexColor("#FFFFFF")
COLOR_ACCENT_BLUE = HexColor("#1D4ED8")   # Deep Royal Blue
COLOR_BLUE_LIGHT = HexColor("#EFF6FF")    # Light Blue Tint


class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas that accurately renders:
    - Running page headers on pages 2+
    - Running page footers with 'Page X of Y' on all pages
    - Top accent branding bands on Cover
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, total_pages):
        page_w, page_h = letter
        margin = 40

        # Page 1 (Cover Page)
        if self._pageNumber == 1:
            self.saveState()
            # Top accent bar
            self.setFillColor(COLOR_PRIMARY)
            self.rect(0, page_h - 10, page_w, 10, fill=1, stroke=0)
            self.setFillColor(COLOR_SECONDARY)
            self.rect(0, page_h - 14, page_w, 4, fill=1, stroke=0)
            
            # Bottom footer line
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(COLOR_PRIMARY)
            self.drawString(margin, 24, "GRAMIN CAREER SETU")
            self.setFont("Helvetica", 8)
            self.setFillColor(COLOR_LIGHT_MUTED)
            self.drawString(margin + 105, 24, "- Formal Academic Project Specification Document | Community Service Project")
            self.drawRightString(page_w - margin, 24, f"Page 1 of {total_pages}")
            self.setStrokeColor(COLOR_BORDER_LIGHT)
            self.setLineWidth(0.6)
            self.line(margin, 34, page_w - margin, 34)
            self.restoreState()
            return

        # Running Header on Pages 2+
        self.saveState()
        self.setFont("Helvetica-Bold", 8)
        self.setFillColor(COLOR_PRIMARY)
        self.drawString(margin, page_h - 26, "GRAMIN CAREER SETU (Gramina Career Setu)")
        self.setFont("Helvetica", 8)
        self.setFillColor(COLOR_LIGHT_MUTED)
        self.drawString(margin + 195, page_h - 26, "|  Project Specification Document")
        self.drawRightString(page_w - margin, page_h - 26, "Academic Year 2026-2027")
        
        self.setStrokeColor(COLOR_BORDER_LIGHT)
        self.setLineWidth(0.6)
        self.line(margin, page_h - 30, page_w - margin, page_h - 30)
        self.restoreState()

        # Running Footer on Pages 2+
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(COLOR_MUTED)
        self.drawString(margin, 24, "Offline-First Bilingual Career Advancement & Employment Bridge Platform")
        self.drawRightString(page_w - margin, 24, f"Page {self._pageNumber} of {total_pages}")
        
        self.setStrokeColor(COLOR_BORDER_LIGHT)
        self.setLineWidth(0.6)
        self.line(margin, 34, page_w - margin, 34)
        self.restoreState()


def make_para(text, style):
    return Paragraph(text, style)


def build_pdf(filename="Gramin_Career_Setu_Project_Overview.pdf"):
    margin = 40
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=margin,
        rightMargin=margin,
        topMargin=38,
        bottomMargin=38
    )

    base_styles = getSampleStyleSheet()

    # Custom Typographic Hierarchy
    style_cover_tag = ParagraphStyle(
        "CoverTag",
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=14,
        textColor=COLOR_PRIMARY,
        alignment=TA_CENTER,
        spaceAfter=8
    )
    style_cover_title = ParagraphStyle(
        "CoverTitle",
        fontName="Helvetica-Bold",
        fontSize=24,
        leading=28,
        textColor=COLOR_PRIMARY,
        alignment=TA_CENTER,
        spaceAfter=6
    )
    style_cover_subtitle = ParagraphStyle(
        "CoverSubtitle",
        fontName="Helvetica",
        fontSize=12,
        leading=16,
        textColor=COLOR_SECONDARY,
        alignment=TA_CENTER,
        spaceAfter=12
    )
    style_cover_tech = ParagraphStyle(
        "CoverTech",
        fontName="Helvetica-Bold",
        fontSize=9,
        leading=13,
        textColor=COLOR_MUTED,
        alignment=TA_CENTER,
        spaceAfter=18
    )
    style_chapter_title = ParagraphStyle(
        "ChapterTitle",
        fontName="Helvetica-Bold",
        fontSize=14,
        leading=18,
        textColor=COLOR_PRIMARY,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )
    style_section_title = ParagraphStyle(
        "SectionTitle",
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=15,
        textColor=COLOR_SECONDARY,
        spaceBefore=10,
        spaceAfter=5,
        keepWithNext=True
    )
    style_sub_section_title = ParagraphStyle(
        "SubSectionTitle",
        fontName="Helvetica-Bold",
        fontSize=9.5,
        leading=13,
        textColor=COLOR_DARK,
        spaceBefore=7,
        spaceAfter=3,
        keepWithNext=True
    )
    style_body = ParagraphStyle(
        "CustomBody",
        fontName="Helvetica",
        fontSize=8.5,
        leading=12,
        textColor=COLOR_DARK,
        spaceAfter=5,
        alignment=TA_JUSTIFY
    )
    style_bullet = ParagraphStyle(
        "CustomBullet",
        fontName="Helvetica",
        fontSize=8.5,
        leading=12,
        textColor=COLOR_MUTED,
        leftIndent=14,
        firstLineIndent=-10,
        spaceAfter=3,
        alignment=TA_JUSTIFY
    )
    style_callout = ParagraphStyle(
        "CalloutText",
        fontName="Helvetica-Oblique",
        fontSize=8.5,
        leading=12,
        textColor=COLOR_PRIMARY,
        spaceAfter=4
    )

    # Table styles
    style_th = ParagraphStyle(
        "TableHeader",
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10,
        textColor=COLOR_WHITE,
        alignment=TA_LEFT
    )
    style_td = ParagraphStyle(
        "TableCell",
        fontName="Helvetica",
        fontSize=7.5,
        leading=10,
        textColor=COLOR_DARK,
        alignment=TA_LEFT
    )
    style_td_bold = ParagraphStyle(
        "TableCellBold",
        fontName="Helvetica-Bold",
        fontSize=7.5,
        leading=10,
        textColor=COLOR_DARK,
        alignment=TA_LEFT
    )

    printable_w = 612 - 2 * margin  # 532 pt

    story = []

    # =========================================================================
    # COVER PAGE
    # =========================================================================
    story.append(Spacer(1, 24))
    story.append(Paragraph("PROJECT DOCUMENT", style_cover_tag))
    story.append(Spacer(1, 8))
    story.append(Paragraph("GRAMIN CAREER SETU", style_cover_title))
    story.append(Paragraph("A Centralized Offline-First, Bilingual Career Empowerment &amp; Employment Bridge Platform for Rural Youth", style_cover_subtitle))
    story.append(Paragraph("<b>Suggested Technology Stack:</b> Semantic HTML5 &bull; Vanilla ES6+ JavaScript &bull; CSS3 Design Tokens &bull; Node.js Native HTTP Gateway &bull; Java 21 / Spring Boot 3.3.5 &bull; PostgreSQL 16 &bull; Keycloak 24.0.5 &bull; Redis 7", style_cover_tech))
    story.append(Spacer(1, 14))

    # Cover Meta Box
    meta_data = [
        [Paragraph("<b>Submitted by</b>", style_td_bold), Paragraph("Yogesh Kamisetty (and Student Project Team)", style_td)],
        [Paragraph("<b>Project Guide / Mentor</b>", style_td_bold), Paragraph("Department of Computer Science &amp; Engineering Faculty", style_td)],
        [Paragraph("<b>Department</b>", style_td_bold), Paragraph("Department of Computer Science and Engineering", style_td)],
        [Paragraph("<b>Institution / Organization</b>", style_td_bold), Paragraph("Affiliated Engineering College / University", style_td)],
        [Paragraph("<b>Academic Year</b>", style_td_bold), Paragraph("2026 &ndash; 2027", style_td)],
        [Paragraph("<b>Project Type</b>", style_td_bold), Paragraph("Community Service Project (CSP) / Capstone Engineering Project", style_td)]
    ]
    t_meta = Table(meta_data, colWidths=[150, printable_w - 150])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), COLOR_BG_CARD),
        ('GRID', (0, 0), (-1, -1), 0.5, COLOR_BORDER),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 18))

    # =========================================================================
    # DECLARATION
    # =========================================================================
    story.append(Paragraph("DECLARATION", style_section_title))
    dec_text = (
        "The undersigned declare that this project document, titled <b>\"Gramin Career Setu\"</b>, describes the proposed "
        "design, technical architecture, and implementation plan for an offline-first, bilingual career empowerment and employment "
        "bridge platform for rural youth. Sources used during implementation, data compilation, and report preparation "
        "have been duly acknowledged."
    )
    story.append(Paragraph(dec_text, style_body))
    story.append(Spacer(1, 8))

    dec_table_data = [
        [Paragraph("<b>No.</b>", style_th), Paragraph("<b>Name</b>", style_th), Paragraph("<b>Signature</b>", style_th), Paragraph("<b>Date</b>", style_th)],
        [Paragraph("1", style_td), Paragraph("Yogesh Kamisetty", style_td), Paragraph("___________________", style_td), Paragraph("05-11-2026", style_td)],
        [Paragraph("2", style_td), Paragraph("Student Contributor 2", style_td), Paragraph("___________________", style_td), Paragraph("05-11-2026", style_td)],
        [Paragraph("3", style_td), Paragraph("Student Contributor 3", style_td), Paragraph("___________________", style_td), Paragraph("05-11-2026", style_td)],
    ]
    t_dec = Table(dec_table_data, colWidths=[35, 210, 160, printable_w - 405])
    t_dec.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), COLOR_PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, COLOR_BORDER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [COLOR_WHITE, COLOR_BG_CARD]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_dec)
    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>Place:</b> Andhra Pradesh, India", style_body))

    story.append(PageBreak())

    # =========================================================================
    # ABSTRACT
    # =========================================================================
    story.append(Paragraph("ABSTRACT", style_chapter_title))
    abs_p1 = (
        "Rural youth across India face severe information divides, language barriers, and intermittent internet connectivity, "
        "severely restricting their awareness of and access to viable economic and educational opportunities. Mainstream job and "
        "career portals are predominantly English-only, require high-bandwidth connections, present unverified or commercially "
        "sponsored listings, and lack contextual guidance tailored to candidates with non-traditional or entry-level educational qualifications. "
        "Furthermore, rural students are often unaware of state and central government welfare schemes, scholarship entitlements, "
        "vocational training programs, and the critical importance of Applicant Tracking System (ATS) compliant resume design."
    )
    story.append(Paragraph(abs_p1, style_body))

    abs_p2 = (
        "<b>Gramin Career Setu</b> is a proposed web-based, offline-first, bilingual (Telugu &amp; English) platform engineered to "
        "bridge the divide between rural talent and formal economic opportunities. The platform unifies: (1) an opportunity exploration "
        "portal offering 35 curated job roles across 10 vital sectors with verified official application links; (2) a comprehensive directory of "
        "active government welfare schemes and updated scholarships; (3) a 5-question RIASEC-informed career aptitude assessment mapping "
        "candidates to distinct career tracks; (4) structured, step-by-step career roadmaps starting from 10th pass, Intermediate, ITI, Diploma, "
        "and Degree qualifications; (5) an 8-step bilingual online application guide; (6) a client-side ATS resume builder with real-time scoring; "
        "and (7) community skill workshop management."
    )
    story.append(Paragraph(abs_p2, style_body))

    abs_p3 = (
        "The architecture implements a dual-tier model: a lightweight, zero-dependency client powered by Semantic HTML5, CSS3 design tokens, "
        "vanilla ES6+ JavaScript, a custom dictionary-driven translation engine (`i18n.js`), and Service Worker caching (~1.1 MB app shell); "
        "coupled with an enterprise backend powered by Java 21, Spring Boot 3.3.5, Keycloak 24.0.5 OAuth2/OIDC role-based access control, "
        "PostgreSQL 16 relational storage with Flyway migrations (V1&ndash;V8), and Redis distributed rate-limiting. The prototype is validated "
        "through 44 automated Node.js security and contract tests, 43 Spring Boot integration tests, cross-browser/cross-device verification, and "
        "strict adherence to Community Service Project (CSP) honest disclosure guidelines. Expected benefits include eliminating informational asymmetry, "
        "empowering rural job seekers with verified pathways, and providing village coordinators with robust digital tools."
    )
    story.append(Paragraph(abs_p3, style_body))
    story.append(Spacer(1, 4))
    story.append(Paragraph("<b>Keywords:</b> rural career empowerment, bilingual education, offline-first PWA, ATS resume builder, scholarship discovery, Spring Boot 3.3.5, Keycloak OIDC, PostgreSQL Flyway, Community Service Project.", style_callout))

    story.append(Spacer(1, 10))

    # =========================================================================
    # TABLE OF CONTENTS
    # =========================================================================
    story.append(Paragraph("TABLE OF CONTENTS", style_chapter_title))
    toc_data = [
        [Paragraph("<b>No.</b>", style_th), Paragraph("<b>Main Section</b>", style_th), Paragraph("<b>Sub-sections</b>", style_th), Paragraph("<b>Page</b>", style_th)],
        [Paragraph("1", style_td), Paragraph("Introduction", style_td_bold), Paragraph("1.1 Purpose, 1.2 Problem Statement, 1.3 Vision &amp; Mission, 1.4 Existing &amp; Proposed Systems, 1.5 Project Charter", style_td), Paragraph("3", style_td)],
        [Paragraph("2", style_td), Paragraph("Scope &amp; Stakeholders", style_td_bold), Paragraph("2.1 Core Functional Scope, 2.2 Advanced / Phase 2 Features, 2.3 Project Boundaries, 2.4 Target Users &amp; Stakeholders, 2.5 Design Principles", style_td), Paragraph("5", style_td)],
        [Paragraph("3", style_td), Paragraph("Methodology &amp; Workflow", style_td_bold), Paragraph("3.1 Methodology Overview, 3.2 Opportunity Types &amp; Sectors, 3.3 End-to-End Workflow, 3.4 Bilingual &amp; Offline Matching, 3.5 Validation Rules, 3.6 Automated Quality &amp; Security, 3.7 Verification Rules, 3.8 Generation Logic", style_td), Paragraph("7", style_td)],
        [Paragraph("4", style_td), Paragraph("System Design &amp; Architecture", style_td_bold), Paragraph("4.1 User Roles &amp; Responsibilities, 4.2 User Workflow, 4.3 Technical Architecture, 4.4 Data Flow, 4.5 Main Modules, 4.6 Enrollment Enforcement, 4.7 Security Considerations", style_td), Paragraph("9", style_td)],
        [Paragraph("5", style_td), Paragraph("Technology Stack", style_td_bold), Paragraph("5.1 Technology Choices &amp; Responsibilities, 5.2 Proposed Data Model, 5.3 Example API Outline", style_td), Paragraph("11", style_td)],
        [Paragraph("6", style_td), Paragraph("Implementation Plan", style_td_bold), Paragraph("6.1 Phases &amp; Deliverables, 6.2 Indicative Costs, 6.3 Deployment Plan", style_td), Paragraph("13", style_td)],
        [Paragraph("7", style_td), Paragraph("Expected Outcomes &amp; Evaluation", style_td_bold), Paragraph("7.1 Expected Outcomes, 7.2 Success Measures, 7.3 Social &amp; Organizational Use, 7.4 Future Enhancements", style_td), Paragraph("14", style_td)],
        [Paragraph("8", style_td), Paragraph("Risks &amp; Validation", style_td_bold), Paragraph("8.1 Risk Assessment, 8.2 Testing Plan, 8.3 Limitations, 8.4 Conclusion", style_td), Paragraph("15", style_td)],
        [Paragraph("App A", style_td), Paragraph("References &amp; Benchmark Projects", style_td_bold), Paragraph("Government Portals, Academic Literature, and Benchmark Comparative Systems", style_td), Paragraph("16", style_td)]
    ]
    t_toc = Table(toc_data, colWidths=[35, 120, 335, printable_w - 490])
    t_toc.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), COLOR_PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, COLOR_BORDER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [COLOR_WHITE, COLOR_BG_CARD]),
        ('TOPPADDING', (0, 0), (-1, -1), 3.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_toc)

    story.append(PageBreak())

    # =========================================================================
    # CHAPTER 1: INTRODUCTION
    # =========================================================================
    story.append(Paragraph("1. Introduction", style_chapter_title))
    story.append(Paragraph(
        "This chapter introduces Gramin Career Setu, the critical societal and informational problems it addresses, "
        "its core objectives, and the governance foundation articulated in the Project Charter.",
        style_body
    ))

    story.append(Paragraph("1.1 Purpose", style_section_title))
    story.append(Paragraph(
        "The purpose of Gramin Career Setu is to provide a reliable, bilingual, and offline-capable career navigation and "
        "employment empowerment portal for rural candidates in India. By integrating verified job role discovery, government "
        "welfare schemes, scholarship tracking, career aptitude assessments, educational roadmaps, and an ATS resume evaluator "
        "into a unified portal, the platform eliminates structural barriers that prevent rural job seekers from participating "
        "in the formal economy.",
        style_body
    ))

    story.append(Paragraph("1.2 Problem Statement", style_section_title))
    story.append(Paragraph(
        "Rural youth across Andhra Pradesh, Telangana, and rural India face systematic hurdles when attempting to transition from "
        "education into sustainable employment. These problems include: (1) <i>Language Barriers</i>: existing national portals (such as NCS) "
        "are heavily English-centric or have fragmented regional translations; (2) <i>Intermittent Connectivity</i>: high-bandwidth web apps "
        "fail on 2G/3G networks; (3) <i>Information Asymmetry</i>: government schemes and scholarships are dispersed across uncoordinated department websites; "
        "(4) <i>Predatory Job Boards</i>: rural job seekers frequently encounter outdated, ghost, or pay-to-apply job postings; and "
        "(5) <i>Resume Disadvantage</i>: lack of familiarity with Applicant Tracking System (ATS) parsing rules leads to immediate algorithmic rejection.",
        style_body
    ))

    story.append(Paragraph("1.3 Vision, Mission &amp; Objectives", style_section_title))
    story.append(Paragraph(
        "<b>Vision:</b> Empower every rural candidate with equal, transparent, and bilingual access to viable career opportunities, "
        "scholarships, and professional job readiness tools regardless of geographical location or economic standing.",
        style_body
    ))
    story.append(Paragraph(
        "<b>Mission:</b> Deliver an offline-first, high-performance web ecosystem that guides rural candidates from career self-discovery "
        "to structured educational roadmaps, verified opportunities, and professional application preparation with human-in-the-loop village coordinator support.",
        style_body
    ))
    story.append(Paragraph("<b>Core Objectives:</b>", style_sub_section_title))
    objs = [
        "Provide 35 curated job roles across 10 sectors (Aviation, Healthcare, Civil Services, Banking, IT, Police, Agriculture, etc.) with direct links to official recruiting bodies.",
        "Curate active state and central scholarships (RTF, MTF, PM-USP CSSS, PM-YASASVI, AICTE Pragati, Saksham, NMMSS, INSPIRE) with verified eligibility criteria.",
        "Deliver seamless real-time bilingual toggling (Telugu &harr; English) across all pages with zero layout flicker and Web Speech voice narration.",
        "Provide a client-side ATS resume builder with real-time scoring, actionable keyword suggestions, and clean print/PDF export.",
        "Implement a 5-question RIASEC-informed aptitude quiz mapping students to 4 distinct career tracks without fabricating match percentages.",
        "Offer step-by-step career roadmaps starting from 10th pass, Intermediate, ITI, Diploma, and Degree qualifications.",
        "Enforce role-based access control (Student, Village Coordinator, District Admin) via Keycloak OIDC and Spring Boot REST security.",
        "Maintain dual verification: 100% automated test pass rate across Node.js gateway tests (44/44) and Spring Boot integration tests (43/43)."
    ]
    for obj in objs:
        story.append(Paragraph(f"&bull; {obj}", style_bullet))

    story.append(Paragraph("1.4 Existing and Proposed Systems", style_section_title))
    story.append(Paragraph(
        "Table 1.1 contrasts conventional career platforms against Gramin Career Setu's offline-first rural architecture.",
        style_body
    ))

    comp_data = [
        [Paragraph("<b>Aspect</b>", style_th), Paragraph("<b>Existing Commercial / Govt Approach</b>", style_th), Paragraph("<b>Proposed Gramin Career Setu Approach</b>", style_th)],
        [Paragraph("Connectivity", style_td_bold), Paragraph("Requires constant 4G/5G; fails or hangs on intermittent 2G/3G connections.", style_td), Paragraph("Offline-first PWA with Service Worker precaching (~1.1 MB shell) and localStorage sync.", style_td)],
        [Paragraph("Language Support", style_td_bold), Paragraph("Predominantly English; machine translations break technical and regional nuances.", style_td), Paragraph("Bilingual Telugu &harr; English dictionary engine (`i18n.js`) with Web Speech voice synthesis.", style_td)],
        [Paragraph("Job Listings", style_td_bold), Paragraph("Aggregated unverified postings, ghost vacancies, and sponsored commercial listings.", style_td), Paragraph("35 curated job roles acting as signposts directly linking to official verified recruiting portals.", style_td)],
        [Paragraph("Welfare &amp; Scholarships", style_td_bold), Paragraph("Scattered across dozens of department portals; cumbersome search criteria.", style_td), Paragraph("Centralized directory of current working state and central scholarships and welfare schemes.", style_td)],
        [Paragraph("Resume Preparation", style_td_bold), Paragraph("Paid subscription templates; server-dependent rendering; non-ATS compliant designs.", style_td), Paragraph("Free client-side ATS resume builder with real-time scoring and native print formatting.", style_td)],
        [Paragraph("Integrity &amp; Honesty", style_td_bold), Paragraph("Fabricated placement claims and exaggerated participant success testimonials.", style_td), Paragraph("Strict CSP disclosure: empty survey kit awaiting field rollout; no invented metrics.", style_td)]
    ]
    t_comp = Table(comp_data, colWidths=[95, 218, printable_w - 313])
    t_comp.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), COLOR_PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, COLOR_BORDER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [COLOR_WHITE, COLOR_BG_CARD]),
        ('TOPPADDING', (0, 0), (-1, -1), 3.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_comp)

    story.append(Spacer(1, 6))

    # Competitive positioning table
    story.append(Paragraph("<b>Table 1.2: Competitive Positioning Matrix</b>", style_sub_section_title))
    pos_data = [
        [Paragraph("<b>Existing Platform</b>", style_th), Paragraph("<b>Key Capabilities</b>", style_th), Paragraph("<b>Observed Positioning</b>", style_th), Paragraph("<b>Our Differentiation</b>", style_th)],
        [Paragraph("National Career Service (NCS)", style_td_bold), Paragraph("Government job listings, counselor directory, state exchange linkage.", style_td), Paragraph("Broad national repository; complex interface, heavy pages, frequent downtime.", style_td), Paragraph("Offline-first PWA, zero dependencies, instant Telugu toggling, qualification filters.", style_td)],
        [Paragraph("Naukri / Indeed", style_td_bold), Paragraph("Commercial private jobs, corporate recruiting, paid resume highlights.", style_td), Paragraph("Optimized for urban white-collar workers; unsuited for 10th/ITI rural candidates.", style_td), Paragraph("Curates entry-level rural roles, direct links, free ATS resume builder, zero commercial ads.", style_td)],
        [Paragraph("State Welfare Portals", style_td_bold), Paragraph("Welfare scheme applications, DBT disbursement tracking.", style_td), Paragraph("Single-department focus; complex bureaucratic terminology and form structures.", style_td), Paragraph("Consolidates multi-department scholarships/schemes with plain-language Telugu guides.", style_td)]
    ]
    t_pos = Table(pos_data, colWidths=[85, 140, 145, printable_w - 370])
    t_pos.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), COLOR_SECONDARY),
        ('GRID', (0, 0), (-1, -1), 0.5, COLOR_BORDER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [COLOR_WHITE, COLOR_BG_CARD]),
        ('TOPPADDING', (0, 0), (-1, -1), 3.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_pos)

    story.append(Paragraph("1.5 Project Charter", style_section_title))
    story.append(Paragraph(
        "<b>Business Case:</b> Millions of rural students complete secondary or technical education without clear guidance on formal employment "
        "channels, competitive entrance exams, or welfare entitlements. By eliminating commercial exploitation and providing a zero-cost, "
        "bilingual portal, Gramin Career Setu reduces unemployment cycle latency and increases welfare scheme uptake.<br/>"
        "<b>Business Model:</b> Designed as a public-good Community Service Project (CSP). Deployed at zero recurring cost via GitHub Pages "
        "for the static client, with open-source containerized backend architecture capable of deployment on state or university cloud servers.<br/>"
        "<b>Charter Objectives:</b> Produce a fully functional, bilingual, offline-first production prototype, verified with automated end-to-end "
        "tests (44 frontend tests, 43 backend integration tests), accompanied by field survey kits and full academic documentation.<br/>"
        "<b>Scope Summary:</b> Covers opportunity catalogs, aptitude testing, roadmaps, scholarship directories, resume creation, workshop tracking, "
        "and administrative telemetry. Excludes automated third-party form filling and direct job guarantee promises.<br/>"
        "<b>Success Criteria:</b> 100% test pass rate, offline availability, sub-1-second client rendering on low-tier mobile devices, and zero security vulnerabilities.",
        style_body
    ))

    story.append(PageBreak())

    # =========================================================================
    # CHAPTER 2: SCOPE AND STAKEHOLDERS
    # =========================================================================
    story.append(Paragraph("2. Scope and Stakeholders", style_chapter_title))
    story.append(Paragraph(
        "This chapter defines the functional boundaries of the current production prototype, outlines planned Phase 2 extensions, "
        "identifies key user groups, and establishes fundamental engineering design principles.",
        style_body
    ))

    story.append(Paragraph("2.1 Core Functional Scope (Current Prototype)", style_section_title))
    core_features = [
        "<b>Bilingual Core Experience:</b> Instant, flicker-free toggling between Telugu and English across all 21 synchronized pages with Web Speech API audio narration.",
        "<b>Role-Based Authentication:</b> 4-step responsive authentication (Mobile + Password, 6-digit confirmation code, and password strength scoring) with role mapping for Students, Volunteers, and District Admins.",
        "<b>35 Curated Job Roles:</b> Verified opportunity catalog spanning Aviation, Healthcare, Civil Services, Banking, IT, Police, Agriculture, and Logistics, filterable by candidate qualification (from 10th pass to Degree).",
        "<b>Direct Official Application Links:</b> Every job role links directly to official recruiting portals (UPSC, SSC, AIIMS, DGCA, Air India, IBPS, State PSCs); no ghost or pay-to-apply links.",
        "<b>Updated Scholarships Directory:</b> State and central schemes with current working names (RTF, MTF, PM-USP CSSS, PM-YASASVI, AICTE Pragati, AICTE Saksham, NMMSS, INSPIRE).",
        "<b>Government Welfare Schemes:</b> Comprehensive guide to key central and state schemes (PM MUDRA, PM Vishwakarma, PMKVY 4.0, AP YSR Cheyutha) with eligibility criteria.",
        "<b>RIASEC Career Aptitude Quiz:</b> 5-question bilingual diagnostic assessment computing weighted fit scores across 4 career tracks (Government, Technical/ITI, BPO/Services, Self-Employment).",
        "<b>Step-by-Step Educational Roadmaps:</b> Multi-stage career pathways starting from 10th pass, Intermediate, ITI, Diploma, and Degree levels with timeline and fee transparency.",
        "<b>8-Step 'Apply Online' Guide:</b> Bilingual, visual step-by-step instructional walkthrough explaining document preparation, fee payment, and portal navigation.",
        "<b>Rural ATS Resume Builder:</b> Client-side resume creation with 5 responsive templates, real-time ATS keyword scoring (0-100%), and print-ready output.",
        "<b>Community Skill Workshops:</b> Curriculum and scheduling engine with capacity controls and participant registration tracking.",
        "<b>Offline-First PWA Shell:</b> Service Worker cache-first architecture precaching core assets (~1.1 MB) for instantaneous loading on 2G/3G networks."
    ]
    for feat in core_features:
        story.append(Paragraph(f"&bull; {feat}", style_bullet))

    story.append(Paragraph("2.2 Advanced / Phase 2 Features (Future Roadmap)", style_section_title))
    phase2_features = [
        "<b>Biometric CSC Center Authentication:</b> Integration with Common Service Center (CSC) Aadhaar fingerprint readers for rural youth lacking mobile OTP capability.",
        "<b>Automated Telugu Unicode Resume PDF Engine:</b> Registering custom Telugu Unicode font glyphs within jsPDF/canvas for direct Telugu PDF binary generation.",
        "<b>SMS / WhatsApp Notification Gateway:</b> Automated push notifications alerting rural candidates when official application windows open for their qualified roles.",
        "<b>AI-Driven Vernacular Mock Interview Agent:</b> Voice-interactive interview coaching providing real-time feedback in spoken Telugu and English.",
        "<b>Live Employment Exchange Webhook Sync:</b> Bi-directional data exchange with District Employment Exchanges for real-time local apprentice quota updates."
    ]
    for feat in phase2_features:
        story.append(Paragraph(f"&bull; {feat}", style_bullet))

    story.append(Paragraph("2.3 Project Boundaries", style_section_title))
    story.append(Paragraph(
        "<b>Prototype Boundaries:</b> The current prototype focuses on verified career discovery, offline guidance, and client-side ATS resume generation. "
        "The system acts as a signpost directly linking candidates to official recruitment bodies; it neither hosts live vacancy databases nor processes "
        "government application fees directly. In accordance with CSP ethical guidelines, all survey analytics and impact figures remain empty until real field rollout.<br/>"
        "<b>Future Expansion Boundaries:</b> Direct API integration with State Public Service Commissions and corporate applicant tracking systems will require formal "
        "institutional partnerships and secure government data gateways.",
        style_body
    ))

    story.append(Paragraph("2.4 Target Users and Stakeholders", style_section_title))
    stakeholders = [
        [Paragraph("<b>Stakeholder Group</b>", style_th), Paragraph("<b>Key Responsibilities / Benefits</b>", style_th)],
        [Paragraph("Rural Students &amp; Job Seekers", style_td_bold), Paragraph("Primary beneficiaries. Access bilingual job roles matching their specific qualification, discover scholarships, evaluate aptitude, and generate ATS-compliant resumes for free.", style_td)],
        [Paragraph("Village Coordinators &amp; Volunteers", style_td_bold), Paragraph("Local community facilitators. Assist low-literacy candidates at Gram Panchayat desks, organize workshops, and conduct field career counseling sessions.", style_td)],
        [Paragraph("District Administrators &amp; Counselors", style_td_bold), Paragraph("Manage localized workshop curricula, monitor regional qualification trends, and review community service project survey feedback.", style_td)],
        [Paragraph("Gram Panchayats &amp; CSC Centers", style_td_bold), Paragraph("Institutional partners. Host offline kiosk access points and display verified opportunity notices.", style_td)],
        [Paragraph("Academic Project Mentors &amp; Institutions", style_td_bold), Paragraph("Evaluate technical and societal impact, ensure rigorous engineering standards, and supervise community deployment.", style_td)],
        [Paragraph("Development &amp; QA Engineering Team", style_td_bold), Paragraph("Maintain architecture, security hardening, automated test suites, and data accuracy across all 35 job roles and welfare programs.", style_td)]
    ]
    t_sh = Table(stakeholders, colWidths=[160, printable_w - 160])
    t_sh.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), COLOR_PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, COLOR_BORDER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [COLOR_WHITE, COLOR_BG_CARD]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_sh)

    story.append(Paragraph("2.5 Design Principles", style_section_title))
    principles = [
        "<b>Accuracy &amp; Transparency First:</b> Only verified official recruitment portals (UPSC, SSC, DGCA, AIIMS, etc.) are linked; zero fabricated employer listings or phantom statistics.",
        "<b>Offline-First Reliability:</b> All core application pages, dictionaries, and resume tools must load and function seamlessly without network access.",
        "<b>Bilingual Equity:</b> Telugu is treated as a primary, first-class citizen alongside English; all navigation, controls, roadmaps, and guides provide complete translation.",
        "<b>Privacy by Design &amp; Least Privilege:</b> No unnecessary personal identifiers collected; sensitive student contact data is masked on the server and protected by strict RBAC.",
        "<b>Traceability &amp; Auditability:</b> Every administrative action, status update, and workshop enrollment is immutably logged for audit verification.",
        "<b>Zero Dependency Overhead:</b> The client avoids bulky third-party frontend frameworks, ensuring blazing-fast execution on sub-US$100 mobile devices."
    ]
    for pr in principles:
        story.append(Paragraph(f"&bull; {pr}", style_bullet))

    story.append(PageBreak())

    # =========================================================================
    # CHAPTER 3: METHODOLOGY AND WORKFLOW
    # =========================================================================
    story.append(Paragraph("3. Methodology and Workflow", style_chapter_title))
    story.append(Paragraph(
        "This chapter details the evidence-informed methodology underlying Gramin Career Setu, the end-to-end user pipeline, "
        "bilingual matching algorithms, validation rules, and automated quality verification.",
        style_body
    ))

    story.append(Paragraph("3.1 Methodology Overview", style_section_title))
    story.append(Paragraph(
        "Gramin Career Setu operates as a structured, phased advancement pipeline: <b>Discover &rarr; Assess &rarr; Navigate &rarr; Prepare &rarr; Apply</b>. "
        "Unlike commercial job boards that inundate users with unranked, sponsored listings, Gramin Career Setu anchors the user journey in the candidate's "
        "verified current educational qualification and self-assessed aptitude track.",
        style_body
    ))

    story.append(Paragraph("3.2 Opportunity Types and Sector Batches", style_section_title))
    story.append(Paragraph(
        "The catalog maintains 35 carefully curated job roles organized across 10 vital employment sectors. Each role is tied to minimum qualification "
        "prerequisites, starting salary benchmarks, official portal authorities, and bilingual career summaries.",
        style_body
    ))

    sectors_data = [
        [Paragraph("<b>Employment Sector</b>", style_th), Paragraph("<b>Sample Roles &amp; Minimum Qualification</b>", style_th), Paragraph("<b>Official Recruiting Authority &amp; Portal</b>", style_th)],
        [Paragraph("Aviation &amp; Aerospace", style_td_bold), Paragraph("Commercial Airline Pilot (10+2 PCM), Cabin Crew / Air Hostess (10+2)", style_td), Paragraph("DGCA (dgca.gov.in), Air India Careers (airindia.com)", style_td)],
        [Paragraph("Healthcare &amp; Medicine", style_td_bold), Paragraph("Medical Officer / Doctor (MBBS), Staff Nurse (B.Sc / GNM Nursing)", style_td), Paragraph("NBE (natboard.edu.in), AIIMS Exams (aiimsexams.ac.in)", style_td)],
        [Paragraph("Civil Services &amp; Govt", style_td_bold), Paragraph("IAS / Civil Servant (Graduation), Village Revenue Officer (Intermediate)", style_td), Paragraph("UPSC (upsc.gov.in), APPSC / TSPSC (psc.ap.gov.in)", style_td)],
        [Paragraph("Banking &amp; Financial Services", style_td_bold), Paragraph("Bank Probationary Officer (Graduation), Rural Bank Assistant (Degree)", style_td), Paragraph("IBPS (ibps.in), State Bank of India (sbi.co.in)", style_td)],
        [Paragraph("IT &amp; Digital Services", style_td_bold), Paragraph("Junior Software Engineer (B.Tech / MCA), Web Developer (Diploma / Any Degree)", style_td), Paragraph("NASSCOM FutureSkills Prime, Direct Employer Portals", style_td)],
        [Paragraph("Police &amp; Defence", style_td_bold), Paragraph("Police Constable (Intermediate), Indian Army Soldier (10th Pass)", style_td), Paragraph("State Police Recruitment Board, Join Indian Army (joinindianarmy.nic.in)", style_td)],
        [Paragraph("Agriculture &amp; Rural Tech", style_td_bold), Paragraph("Agricultural Extension Officer (B.Sc Agri), Kisan Dron Pilot (10th Pass + ITI)", style_td), Paragraph("ICAR (icar.org.in), State Agriculture Department", style_td)],
        [Paragraph("Logistics &amp; Transport", style_td_bold), Paragraph("Railway Assistant Loco Pilot (10th + ITI), Commercial Transport Driver (10th + HMV)", style_td), Paragraph("Railway Recruitment Board (rrbcdg.gov.in), State RTC", style_td)],
        [Paragraph("Self-Employment &amp; MSME", style_td_bold), Paragraph("Solar Technician (ITI Electrical), Village CSC Entrepreneur (10th / 12th)", style_td), Paragraph("PM Vishwakarma (pmvishwakarma.gov.in), PM MUDRA Portal", style_td)]
    ]
    t_sec = Table(sectors_data, colWidths=[110, 210, printable_w - 320])
    t_sec.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), COLOR_PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, COLOR_BORDER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [COLOR_WHITE, COLOR_BG_CARD]),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_sec)

    story.append(Paragraph("3.3 End-to-End User Workflow", style_section_title))
    wf_steps = [
        "<b>Step 1 &ndash; Portal Discovery:</b> The candidate lands on the PWA. Service Worker caches the app shell. The user toggles between English and Telugu as preferred.",
        "<b>Step 2 &ndash; Career Aptitude Self-Assessment:</b> The candidate completes the 5-question RIASEC aptitude quiz (`quiz.html`), evaluating behavioral and work style preferences.",
        "<b>Step 3 &ndash; Track Mapping &amp; Roadmaps:</b> Quiz scores map candidates to one of 4 career tracks (Government, ITI/Technical, BPO/Services, Self-Employment), directly leading into the educational roadmap (`roadmap.html`).",
        "<b>Step 4 &ndash; Role &amp; Opportunity Filtering:</b> Candidate filters 35 job roles (`jobs.html`) by their specific education level (10th pass, Intermediate, ITI, Degree, etc.), preventing premature or invalid aspirations.",
        "<b>Step 5 &ndash; Scheme &amp; Scholarship Discovery:</b> The student identifies entitlements (`scholarships.html` and `schemes.html`) to fund examinations or vocational training.",
        "<b>Step 6 &ndash; Skill Workshop Registration:</b> The candidate enrolls in practical offline workshops (`workshops.html`) conducted by village coordinators.",
        "<b>Step 7 &ndash; ATS Resume Building:</b> The candidate opens the resume builder (`resume.html`), selects from 5 professional templates, achieves an optimal ATS score, and exports a print-ready document.",
        "<b>Step 8 &ndash; Official Online Application:</b> The candidate follows the 8-step guide (`apply-online.html`) to submit their application on the official recruitment authority's website."
    ]
    for st in wf_steps:
        story.append(Paragraph(st, style_bullet))

    story.append(Paragraph("3.4 Bilingual &amp; Offline Matching Engine", style_section_title))
    story.append(Paragraph(
        "Gramin Career Setu eliminates runtime translation latency by utilizing a synchronous client-side dictionary architecture (`assets/i18n.js` and `assets/i18n-dict.js`). "
        "DOM elements declare `data-i18n` attributes corresponding to dictionary keys. When toggled, the engine traverses the DOM tree and replaces text content instantaneously "
        "without triggering external network calls. Web Speech API synthesis (`window.speechSynthesis`) is bound to card narration buttons to speak Telugu and English text aloud.",
        style_body
    ))

    story.append(Paragraph("3.5 Validation and Eligibility Rules", style_section_title))
    valid_data = [
        [Paragraph("<b>Form / Field</b>", style_th), Paragraph("<b>Validation Rule</b>", style_th), Paragraph("<b>Expected System Action on Violation</b>", style_th)],
        [Paragraph("Mobile Number", style_td_bold), Paragraph("Must be exactly 10 numeric digits conforming to Indian numbering plan (`^[6-9]\\d{9}$`).", style_td), Paragraph("Display inline error; block OTP generation; prevent form submission.", style_td)],
        [Paragraph("Password Strength", style_td_bold), Paragraph("Minimum 8 characters with at least 1 uppercase, 1 lowercase, 1 digit, and 1 symbol.", style_td), Paragraph("Visual strength meter updates in real-time; submit disabled until 'Strong'.", style_td)],
        [Paragraph("Confirmation OTP", style_td_bold), Paragraph("Must match 6-digit client-generated verification token.", style_td), Paragraph("Show error message; allow resend after 30-second cooldown.", style_td)],
        [Paragraph("Job Filtering", style_td_bold), Paragraph("Candidate qualification must match or exceed role prerequisite.", style_td), Paragraph("Highlight qualification gap; display prerequisite roadmap steps.", style_td)],
        [Paragraph("Workshop Registration", style_td_bold), Paragraph("Workshop capacity must not be exceeded; candidate must not be duplicate.", style_td), Paragraph("Backend concurrency lock rejects oversubscription; returns HTTP 400 with capacity warning.", style_td)],
        [Paragraph("Resume ATS Objective", style_td_bold), Paragraph("Length capped at 300 characters to prevent ATS parser truncation.", style_td), Paragraph("Enforce `maxlength=\"300\"` in markup; live character counter warns at 280.", style_td)]
    ]
    t_valid = Table(valid_data, colWidths=[100, 210, printable_w - 310])
    t_valid.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), COLOR_SECONDARY),
        ('GRID', (0, 0), (-1, -1), 0.5, COLOR_BORDER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [COLOR_WHITE, COLOR_BG_CARD]),
        ('TOPPADDING', (0, 0), (-1, -1), 3.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_valid)

    story.append(Paragraph("3.6 Automated Quality and Security Checking", style_section_title))
    story.append(Paragraph(
        "Quality assurance is continuously executed across every layer: (1) <i>Static File Server</i> rejects URL-encoded path traversal attacks (`../`); "
        "(2) <i>HTTP Security Headers</i> enforce strict Content Security Policy (CSP), HSTS, and X-Content-Type-Options; (3) <i>API Gateway</i> enforces "
        "distributed rate-limiting (100 req/min per IP); and (4) <i>PII Protection</i> masks sensitive mobile numbers (`98******10`) in logs and JSON responses.",
        style_body
    ))

    story.append(PageBreak())

    # =========================================================================
    # CHAPTER 4: SYSTEM DESIGN AND ARCHITECTURE
    # =========================================================================
    story.append(Paragraph("4. System Design and Architecture", style_chapter_title))
    story.append(Paragraph(
        "This chapter outlines the four-tiered technical architecture of Gramin Career Setu, detailed user workflows, module interactions, "
        "and security enforcement mechanisms.",
        style_body
    ))

    story.append(Paragraph("4.1 User Roles and Responsibilities", style_section_title))
    roles_data = [
        [Paragraph("<b>User Role</b>", style_th), Paragraph("<b>Access Privileges</b>", style_th), Paragraph("<b>Core Operational Responsibilities</b>", style_th)],
        [Paragraph("Student / Job Seeker", style_td_bold), Paragraph("Public pages, personalized dashboard, quiz, resume builder, workshop registration.", style_td), Paragraph("Self-assess career aptitude, explore qualified jobs and scholarships, build ATS resumes, and register for local training.", style_td)],
        [Paragraph("Village Coordinator / Volunteer", style_td_bold), Paragraph("Student assistance mode, offline kiosk operation, workshop participant check-in.", style_td), Paragraph("Facilitate registration for low-literacy candidates, verify village documentation, and manage workshop venues.", style_td)],
        [Paragraph("District Administrator", style_td_bold), Paragraph("Full administrative dashboard (`/admin`), user status management, workshop scheduling, audit log inspection.", style_td), Paragraph("Publish local workshop schedules, review community survey trends, audit system security, and configure regional opportunity parameters.", style_td)]
    ]
    t_roles = Table(roles_data, colWidths=[110, 160, printable_w - 270])
    t_roles.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), COLOR_PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, COLOR_BORDER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [COLOR_WHITE, COLOR_BG_CARD]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_roles)

    story.append(Paragraph("4.2 User Workflow Stages", style_section_title))
    wf_stages = [
        [Paragraph("<b>Stage</b>", style_th), Paragraph("<b>User Action</b>", style_th), Paragraph("<b>System Response &amp; Enforcement</b>", style_th)],
        [Paragraph("Discovery", style_td_bold), Paragraph("Visits site on mobile browser.", style_td), Paragraph("Service worker activates; precaches app shell; loads in &lt;1.1 seconds.", style_td)],
        [Paragraph("Language Select", style_td_bold), Paragraph("Clicks Telugu / English toggle.", style_td), Paragraph("Synchronous DOM attribute translation; persists choice in `localStorage`.", style_td)],
        [Paragraph("Authentication", style_td_bold), Paragraph("Enters mobile, sets password, inputs verification code.", style_td), Paragraph("Bcrypt/Argon2 password hash; returns JWT token; sets user role session.", style_td)],
        [Paragraph("Aptitude Quiz", style_td_bold), Paragraph("Answers 5 RIASEC assessment questions.", style_td), Paragraph("Calculates weighted track affinity; unlocks corresponding career roadmap.", style_td)],
        [Paragraph("Role Filtering", style_td_bold), Paragraph("Selects qualification (e.g., '10th Pass').", style_td), Paragraph("Filters 35 roles to exact eligible subset; shows official application URLs.", style_td)],
        [Paragraph("Resume Building", style_td_bold), Paragraph("Inputs education, skills, and summary.", style_td), Paragraph("Computes real-time ATS score (0-100%); formats responsive resume preview.", style_td)],
        [Paragraph("Resume Export", style_td_bold), Paragraph("Clicks 'Download PDF' or 'Print'.", style_td), Paragraph("Triggers client-side PDF/print dialog; applies clean, pagination-safe CSS.", style_td)],
        [Paragraph("Workshop Enrollment", style_td_bold), Paragraph("Enrolls in upcoming village workshop.", style_td), Paragraph("Verifies capacity; records registration; generates unique confirmation ID.", style_td)],
        [Paragraph("Admin Telemetry", style_td_bold), Paragraph("Admin inspects system health.", style_td), Paragraph("Displays real-time metrics, audit logs, and empty CSP survey kit.", style_td)]
    ]
    t_wfs = Table(wf_stages, colWidths=[80, 180, printable_w - 260])
    t_wfs.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), COLOR_SECONDARY),
        ('GRID', (0, 0), (-1, -1), 0.5, COLOR_BORDER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [COLOR_WHITE, COLOR_BG_CARD]),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_wfs)

    story.append(Paragraph("4.3 Technical Architecture", style_section_title))
    arch_data = [
        [Paragraph("<b>Architectural Layer</b>", style_th), Paragraph("<b>Technologies &amp; Components</b>", style_th), Paragraph("<b>Core Responsibilities</b>", style_th)],
        [Paragraph("1. Presentation Layer (PWA Client)", style_td_bold), Paragraph("Semantic HTML5, CSS3 Tokens, Vanilla ES6+ JS, Service Worker (`sw.js`).", style_td), Paragraph("Responsive client rendering, offline resource caching, zero-runtime-dependency execution on mobile browsers.", style_td)],
        [Paragraph("2. Edge Gateway Layer", style_td_bold), Paragraph("Node.js native HTTP server (`server.js`).", style_td), Paragraph("Reverse proxy for `/api/v1/*`, path-traversal sanitization, static asset streaming, strict HTTP security headers (CSP, HSTS).", style_td)],
        [Paragraph("3. Application &amp; Security Layer", style_td_bold), Paragraph("Java 21, Spring Boot 3.3.5, Keycloak 24.0.5, Spring Security 6.", style_td), Paragraph("OAuth2/OIDC JWT validation, RBAC enforcement, business domain services (Jobs, Quiz, Workshops, Resumes, Admin).", style_td)],
        [Paragraph("4. Data Persistence &amp; Cache Layer", style_td_bold), Paragraph("PostgreSQL 16 Alpine, Redis 7 Alpine, Flyway Migration Engine.", style_td), Paragraph("Relational ACID storage, composite index query optimization, Flyway schema versioning (V1&ndash;V8), distributed rate-limiting.", style_td)]
    ]
    t_arch = Table(arch_data, colWidths=[120, 160, printable_w - 280])
    t_arch.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), COLOR_PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, COLOR_BORDER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [COLOR_WHITE, COLOR_BG_CARD]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_arch)

    story.append(Paragraph("4.4 Data Flow Between Modules", style_section_title))
    story.append(Paragraph(
        "Candidate interactions follow a secure, unidirectional data flow: user inputs are validated on the client, passed through the Node.js reverse proxy, "
        "authenticated via Keycloak JWT claims, processed by transactional Spring Boot services, persisted to PostgreSQL, and audited in immutable event logs. "
        "Offline submissions are queued in browser `localStorage` and synchronized automatically upon reconnection.",
        style_body
    ))

    story.append(Paragraph("4.5 Main Application Modules", style_section_title))
    modules = [
        "<b>Auth &amp; Role Management:</b> Handles login, registration, Keycloak OIDC integration, session state, and route protection.",
        "<b>Opportunity &amp; Job Catalog:</b> Serves 35 curated job roles generated from `data/jobs.csv`, filterable by qualification prerequisites.",
        "<b>Career Aptitude Quiz Engine:</b> Computes weighted scoring across RIASEC tracks and generates recommendations.",
        "<b>Educational Roadmap Navigator:</b> Outlines milestone-driven career journeys from 10th pass through technical degrees.",
        "<b>ATS Resume Builder Engine:</b> Evaluates resume keyword density, section formatting, and generates print-ready artifacts.",
        "<b>Government Schemes &amp; Scholarships Directory:</b> Catalogs central and state welfare entitlements with current working names.",
        "<b>Workshop Management Engine:</b> Manages offline community training schedules, capacity locks, and registration records.",
        "<b>Admin Telemetry &amp; Survey Module:</b> Aggregates operational health metrics and provides the standardized field survey kit."
    ]
    for m in modules:
        story.append(Paragraph(f"&bull; {m}", style_bullet))

    story.append(Paragraph("4.6 Issuance and Enrollment Enforcement", style_section_title))
    enf_data = [
        [Paragraph("<b>Condition</b>", style_th), Paragraph("<b>Server-Side Enforcement Mechanism</b>", style_th)],
        [Paragraph("Data Validity", style_td_bold), Paragraph("Hibernate Validator (`@Valid`) checks all request DTO fields before controller execution.", style_td)],
        [Paragraph("Active Authorization", style_td_bold), Paragraph("Spring Security validates JWT token expiration, signature against Keycloak JWKS, and RBAC roles.", style_td)],
        [Paragraph("Distributed Rate Limiting", style_td_bold), Paragraph("Redis token bucket filter restricts requests to 100 req/min per IP address, preventing DoS abuse.", style_td)],
        [Paragraph("Capacity Concurrency", style_td_bold), Paragraph("Pessimistic database locking (`@Lock(LockModeType.PESSIMISTIC_WRITE)`) prevents workshop oversubscription.", style_td)],
        [Paragraph("PII Masking", style_td_bold), Paragraph("Server sanitizes and masks candidate phone numbers (`98******10`) in logs and external responses.", style_td)]
    ]
    t_enf = Table(enf_data, colWidths=[130, printable_w - 130])
    t_enf.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), COLOR_SECONDARY),
        ('GRID', (0, 0), (-1, -1), 0.5, COLOR_BORDER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [COLOR_WHITE, COLOR_BG_CARD]),
        ('TOPPADDING', (0, 0), (-1, -1), 3.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(t_enf)

    story.append(PageBreak())

    # =========================================================================
    # CHAPTER 5: TECHNOLOGY STACK
    # =========================================================================
    story.append(Paragraph("5. Technology Stack", style_chapter_title))
    story.append(Paragraph(
        "This chapter enumerates the engineering technology selections for each subsystem, the relational data model, "
        "and the standardized REST API surface.",
        style_body
    ))

    story.append(Paragraph("5.1 Technology Choices and Responsibilities", style_section_title))
    tech_data = [
        [Paragraph("<b>Subsystem</b>", style_th), Paragraph("<b>Technology Choice</b>", style_th), Paragraph("<b>Engineering Responsibility</b>", style_th)],
        [Paragraph("Frontend Client", style_td_bold), Paragraph("Semantic HTML5, CSS3 Tokens, Vanilla ES6+ JavaScript", style_td), Paragraph("Zero-dependency responsive UI; low-RAM mobile execution; fast DOM hydration.", style_td)],
        [Paragraph("Bilingual Translation", style_td_bold), Paragraph("Custom `i18n.js` &amp; Web Speech API", style_td), Paragraph("Flicker-free Telugu/English translation; synthesized vernacular voice narration.", style_td)],
        [Paragraph("Edge Server &amp; Gateway", style_td_bold), Paragraph("Node.js Native HTTP Server (`server.js`)", style_td), Paragraph("Static asset streaming, API reverse proxying, path-traversal blocking, security headers.", style_td)],
        [Paragraph("Backend Framework", style_td_bold), Paragraph("Java 21, Spring Boot 3.3.5 (Spring MVC, Data JPA)", style_td), Paragraph("Modular monolith REST API; transactional domain logic; enterprise robustness.", style_td)],
        [Paragraph("Identity &amp; RBAC", style_td_bold), Paragraph("Keycloak 24.0.5 (OAuth2 / OIDC)", style_td), Paragraph("Stateless JWT issuance and verification; Student, Volunteer, Admin role enforcement.", style_td)],
        [Paragraph("Relational Database", style_td_bold), Paragraph("PostgreSQL 16 Alpine + Flyway Migration", style_td), Paragraph("ACID-compliant storage; Flyway automated schema migrations (V1&ndash;V8).", style_td)],
        [Paragraph("Distributed Cache &amp; Rate", style_td_bold), Paragraph("Redis 7 Alpine (`StringRedisTemplate`)", style_td), Paragraph("Distributed atomic request rate limiting (100 req/min) with in-memory fallback.", style_td)],
        [Paragraph("Containerization &amp; DevOps", style_td_bold), Paragraph("Docker Compose v3.8, GitHub Actions CI", style_td), Paragraph("Multi-container orchestration; automated build and test pipeline on every push.", style_td)]
    ]
    t_tech = Table(tech_data, colWidths=[110, 160, printable_w - 270])
    t_tech.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), COLOR_PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, COLOR_BORDER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [COLOR_WHITE, COLOR_BG_CARD]),
        ('TOPPADDING', (0, 0), (-1, -1), 3.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_tech)

    story.append(Paragraph("5.2 Proposed Data Model", style_section_title))
    model_data = [
        [Paragraph("<b>Entity / Table</b>", style_th), Paragraph("<b>Key Attributes &amp; Schema Fields</b>", style_th), Paragraph("<b>Description &amp; Relationship</b>", style_th)],
        [Paragraph("`users`", style_td_bold), Paragraph("`id, username, password_hash, role, phone_masked, active, created_at`", style_td), Paragraph("Stores core user credentials, role assignment, and account status.", style_td)],
        [Paragraph("`jobs`", style_td_bold), Paragraph("`id, title_en, title_te, sector, min_qualification, official_url, salary`", style_td), Paragraph("Maintains 35 curated job roles with bilingual titles and verified URLs.", style_td)],
        [Paragraph("`scholarships`", style_td_bold), Paragraph("`id, name, level, category, current_working_name, official_url`", style_td), Paragraph("Catalogs national and state scholarships with current official names.", style_td)],
        [Paragraph("`schemes`", style_td_bold), Paragraph("`id, name_en, name_te, ministry, eligibility, benefit, apply_url`", style_td), Paragraph("Stores central and state welfare entitlements for rural youth and MSMEs.", style_td)],
        [Paragraph("`workshops`", style_td_bold), Paragraph("`id, title, date, venue, max_capacity, enrolled_count, status`", style_td), Paragraph("Tracks offline community training sessions and enforce capacity locks.", style_td)],
        [Paragraph("`workshop_registrations`", style_td_bold), Paragraph("`id, workshop_id, student_name, student_phone_masked, registered_at`", style_td), Paragraph("Records participant enrollments with PII masking and uniqueness constraints.", style_td)],
        [Paragraph("`quiz_attempts`", style_td_bold), Paragraph("`id, user_id, answers_hash, recommended_track, score, completed_at`", style_td), Paragraph("Stores diagnostic aptitude responses and mapped career track recommendations.", style_td)],
        [Paragraph("`audit_logs`", style_td_bold), Paragraph("`id, actor_id, action, target_resource, client_ip, timestamp`", style_td), Paragraph("Immutable security audit log recording administrative and operational events.", style_td)]
    ]
    t_model = Table(model_data, colWidths=[110, 200, printable_w - 310])
    t_model.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), COLOR_SECONDARY),
        ('GRID', (0, 0), (-1, -1), 0.5, COLOR_BORDER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [COLOR_WHITE, COLOR_BG_CARD]),
        ('TOPPADDING', (0, 0), (-1, -1), 3.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_model)

    story.append(Paragraph("5.3 Example API Outline", style_section_title))
    api_data = [
        [Paragraph("<b>HTTP Method &amp; Endpoint</b>", style_th), Paragraph("<b>Function &amp; Payload Summary</b>", style_th), Paragraph("<b>Access Control</b>", style_th)],
        [Paragraph("`POST /api/v1/auth/login`", style_td_bold), Paragraph("Authenticate user via mobile + password; issues signed JWT.", style_td), Paragraph("Public", style_td)],
        [Paragraph("`GET /api/v1/jobs`", style_td_bold), Paragraph("Retrieve qualified job roles; supports `qualification` and `sector` filters.", style_td), Paragraph("Public / Student", style_td)],
        [Paragraph("`GET /api/v1/scholarships`", style_td_bold), Paragraph("Fetch verified state and central scholarships with active portal URLs.", style_td), Paragraph("Public / Student", style_td)],
        [Paragraph("`POST /api/v1/quiz/submit`", style_td_bold), Paragraph("Submit 5-question RIASEC responses; computes weighted career track.", style_td), Paragraph("Authenticated", style_td)],
        [Paragraph("`GET /api/v1/workshops`", style_td_bold), Paragraph("List upcoming community skill workshops with real-time capacity counts.", style_td), Paragraph("Public / Student", style_td)],
        [Paragraph("`POST /api/v1/workshops/register`", style_td_bold), Paragraph("Register for workshop; acquires pessimistic database lock against capacity.", style_td), Paragraph("Authenticated", style_td)],
        [Paragraph("`POST /api/v1/resumes/calculate-ats`", style_td_bold), Paragraph("Evaluate resume JSON structure against ATS standards; returns score &amp; advice.", style_td), Paragraph("Authenticated", style_td)],
        [Paragraph("`GET /api/v1/admin/stats`", style_td_bold), Paragraph("Aggregate system telemetry: users, enrollments, quiz attempts, audit metrics.", style_td), Paragraph("ROLE_ADMIN", style_td)]
    ]
    t_api = Table(api_data, colWidths=[150, 250, printable_w - 400])
    t_api.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), COLOR_PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, COLOR_BORDER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [COLOR_WHITE, COLOR_BG_CARD]),
        ('TOPPADDING', (0, 0), (-1, -1), 3.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_api)

    story.append(PageBreak())

    # =========================================================================
    # CHAPTER 6: IMPLEMENTATION PLAN
    # =========================================================================
    story.append(Paragraph("6. Implementation Plan", style_chapter_title))
    story.append(Paragraph(
        "This chapter presents the sequential implementation timeline, operational cost considerations, and deployment architecture.",
        style_body
    ))

    story.append(Paragraph("6.1 Phases and Deliverables", style_section_title))
    plan_data = [
        [Paragraph("<b>Phase</b>", style_th), Paragraph("<b>Main Work &amp; Engineering Focus</b>", style_th), Paragraph("<b>Key Deliverables</b>", style_th), Paragraph("<b>Duration</b>", style_th)],
        [Paragraph("Phase 1: Requirements &amp; Field Survey", style_td_bold), Paragraph("Analyze rural career divide, gather user needs, draft bilingual wireframes.", style_td), Paragraph("Functional specs, survey kit, wireframes.", style_td), Paragraph("2 Weeks", style_td)],
        [Paragraph("Phase 2: Core Frontend &amp; PWA Shell", style_td_bold), Paragraph("Build 21 HTML5 pages, CSS3 design tokens, `i18n.js` bilingual engine, Service Worker.", style_td), Paragraph("Bilingual responsive PWA shell (~1.1 MB).", style_td)],
        [Paragraph("Phase 3: Opportunity &amp; Resume Engines", style_td_bold), Paragraph("Curate 35 job roles (`jobs.csv`), roadmaps, scholarships, ATS resume builder.", style_td), Paragraph("Opportunity catalog, ATS engine, quiz module.", style_td)],
        [Paragraph("Phase 4: Backend &amp; Security Architecture", style_td_bold), Paragraph("Develop Spring Boot 3.3.5 REST API, Keycloak OIDC RBAC, PostgreSQL Flyway migrations.", style_td), Paragraph("Containerized monolith, Flyway V1&ndash;V8.", style_td)],
        [Paragraph("Phase 5: Automated Testing &amp; Hardening", style_td_bold), Paragraph("Author Node.js gateway tests (44/44), Spring Boot integration tests (43/43), rate limiting.", style_td), Paragraph("Dual-suite test coverage, CI pipeline.", style_td)],
        [Paragraph("Phase 6: Field Rollout &amp; Evaluation", style_td_bold), Paragraph("Deploy static PWA to GitHub Pages, conduct village workshop pilot, administer survey.", style_td), Paragraph("Live public portal, field impact report.", style_td)]
    ]
    t_plan = Table(plan_data, colWidths=[100, 190, 172, printable_w - 462])
    t_plan.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), COLOR_PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, COLOR_BORDER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [COLOR_WHITE, COLOR_BG_CARD]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_plan)

    story.append(Paragraph("6.2 Indicative Costs", style_section_title))
    story.append(Paragraph(
        "<b>Zero-Cost Public Deployment:</b> The static Progressive Web App client deploys completely free of charge to GitHub Pages, "
        "allowing unlimited bandwidth and zero server hosting charges for rural job seekers.<br/>"
        "<b>Backend Cloud Infrastructure (Optional Phase 2):</b> For hosting the Spring Boot REST API, Keycloak, PostgreSQL, and Redis in production, "
        "the system can be orchestrated on a modest Linux VPS (2 vCPU, 4GB RAM) at an indicative cost of US$10&ndash;15/month, or hosted on existing "
        "university/government server infrastructure with zero additional software licensing fees.",
        style_body
    ))

    story.append(Paragraph("6.3 Deployment Plan", style_section_title))
    story.append(Paragraph(
        "Continuous Integration and Deployment (CI/CD) is automated via GitHub Actions (`.github/workflows/ci.yml`). Every push to `main` "
        "automatically triggers: (1) Java 21 JDK setup and `mvn clean test` across all 43 backend integration tests; (2) Node.js test execution "
        "running all 44 security and gateway tests (`npm test`); (3) Dependency vulnerability auditing; and (4) Docker image build verification.",
        style_body
    ))

    story.append(PageBreak())
    story.append(Paragraph("7. Expected Outcomes and Evaluation", style_chapter_title))
    story.append(Paragraph(
        "This chapter outlines the measurable social and organizational outcomes achieved by the platform, evaluation benchmarks, and future enhancements.",
        style_body
    ))

    story.append(Paragraph("7.1 Expected Outcomes", style_section_title))
    outcomes = [
        "<b>Elimination of Informational Asymmetry:</b> Rural candidates obtain instant, bilingual awareness of 35 verified job roles and 8+ national/state scholarships.",
        "<b>Qualification-Aligned Career Exploration:</b> Prevents misguided applications by filtering roles strictly to what a student is currently qualified for.",
        "<b>Algorithmic ATS Advantage:</b> Equips rural job seekers with free ATS-optimized resumes that avoid instant rejection by automated hiring systems.",
        "<b>Offline Accessibility:</b> Candidates in low-connectivity rural pockets can navigate opportunities and prepare resumes without requiring continuous mobile data.",
        "<b>Community Service Empowerment:</b> Village coordinators and volunteers are equipped with standardized digital tools to assist their local communities."
    ]
    for o in outcomes:
        story.append(Paragraph(f"&bull; {o}", style_bullet))

    story.append(Paragraph("7.2 Success Measures and Evaluation Methods", style_section_title))
    metrics_data = [
        [Paragraph("<b>Evaluation Dimension</b>", style_th), Paragraph("<b>Target Acceptance Benchmark</b>", style_th), Paragraph("<b>Evaluation &amp; Verification Method</b>", style_th)],
        [Paragraph("Gateway &amp; Client Tests", style_td_bold), Paragraph("100% pass rate (44/44 tests)", style_td), Paragraph("Automated Node.js test suite (`npm test`) in CI pipeline.", style_td)],
        [Paragraph("Backend Integration Tests", style_td_bold), Paragraph("100% pass rate (43/43 tests)", style_td), Paragraph("Automated Maven Surefire suite (`mvn test`) covering RBAC &amp; locking.", style_td)],
        [Paragraph("Initial Load Time", style_td_bold), Paragraph("&lt; 1.5 seconds on simulated 3G", style_td), Paragraph("Lighthouse PWA audit; zero external CDN dependencies.", style_td)],
        [Paragraph("Offline Availability", style_td_bold), Paragraph("100% of core pages load offline", style_td), Paragraph("Network disconnect simulation in Chrome DevTools.", style_td)],
        [Paragraph("Bilingual Coverage", style_td_bold), Paragraph("100% coverage across 21 pages", style_td), Paragraph("Comprehensive DOM translation dictionary audit.", style_td)],
        [Paragraph("Job URL Validity", style_td_bold), Paragraph("100% live verified official URLs", style_td), Paragraph("HTTP link verification scan against recruiting authorities.", style_td)],
        [Paragraph("Security Compliance", style_td_bold), Paragraph("Zero high-severity vulnerabilities", style_td), Paragraph("`npm audit --audit-level=high` and OWASP Top 10 header scan.", style_td)],
        [Paragraph("Field Survey Engagement", style_td_bold), Paragraph("100+ rural student responses", style_td), Paragraph("Administer standardized pre/post workshop survey kit.", style_td)]
    ]
    t_met = Table(metrics_data, colWidths=[120, 150, printable_w - 270])
    t_met.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), COLOR_PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, COLOR_BORDER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [COLOR_WHITE, COLOR_BG_CARD]),
        ('TOPPADDING', (0, 0), (-1, -1), 3.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_met)

    story.append(PageBreak())

    # =========================================================================
    # CHAPTER 8: RISKS AND VALIDATION
    # =========================================================================
    story.append(Paragraph("8. Risks and Validation", style_chapter_title))
    story.append(Paragraph(
        "This chapter identifies critical technical and operational risks, establishes comprehensive mitigation strategies, "
        "details the testing plan, defines operational limitations, and concludes the specification.",
        style_body
    ))

    story.append(Paragraph("8.1 Risk Assessment and Mitigation", style_section_title))
    risk_data = [
        [Paragraph("<b>Identified Risk</b>", style_th), Paragraph("<b>Impact Severity</b>", style_th), Paragraph("<b>Mitigation &amp; Validation Approach</b>", style_th)],
        [Paragraph("External Official URL Staling", style_td_bold), Paragraph("Medium", style_td), Paragraph("Job links point to canonical recruiting domains (e.g., `upsc.gov.in`); automated CI check alerts on broken links.", style_td)],
        [Paragraph("Intermittent Network Failure", style_td_bold), Paragraph("High", style_td), Paragraph("Offline-first Service Worker caching ensures core app shell and resume tools function without connectivity.", style_td)],
        [Paragraph("Workshop Capacity Race Conditions", style_td_bold), Paragraph("High", style_td), Paragraph("Pessimistic database locking (`@Lock`) in Spring Data JPA prevents oversubscription across concurrent sessions.", style_td)],
        [Paragraph("PII Data Exposure in Logs", style_td_bold), Paragraph("Critical", style_td), Paragraph("`PiiUtils` sanitization masks phone numbers and personal identifiers prior to logging or client serialization.", style_td)],
        [Paragraph("Path Traversal &amp; Injection Attacks", style_td_bold), Paragraph("Critical", style_td), Paragraph("Native Node gateway normalizes and validates URI paths; Spring JPA utilizes parameterized queries.", style_td)],
        [Paragraph("Misleading Community Metrics", style_td_bold), Paragraph("High", style_td), Paragraph("Strict CSP disclosure: impact dashboard displays empty survey kit until live workshop data is gathered.", style_td)]
    ]
    t_risk = Table(risk_data, colWidths=[130, 80, printable_w - 210])
    t_risk.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), COLOR_SECONDARY),
        ('GRID', (0, 0), (-1, -1), 0.5, COLOR_BORDER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [COLOR_WHITE, COLOR_BG_CARD]),
        ('TOPPADDING', (0, 0), (-1, -1), 3.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_risk)

    story.append(Paragraph("8.2 Testing Plan and Dual-Verification Methodology", style_section_title))
    story.append(Paragraph(
        "The project applies a dual-verification testing strategy: (1) <i>Frontend &amp; Gateway Testing</i>: 44 Node.js tests (`tests/project.test.js`) "
        "validating path traversal defense, HTTP security headers, CORS isolation, API reverse proxying, and content integrity; and (2) <i>Backend Integration Testing</i>: "
        "43 Spring Boot tests (`mvn test`) validating Flyway migrations V1&ndash;V8, concurrency locks, Redis distributed rate-limiting, and Keycloak RBAC.",
        style_body
    ))

    story.append(Paragraph("8.3 System Limitations", style_section_title))
    story.append(Paragraph(
        "<b>Live Vacancy Scraping:</b> To avoid fragility caused by government portal layout changes, the platform curates verified role categories "
        "and links to official boards rather than running brittle screen scrapers.<br/>"
        "<b>Telugu PDF Generation:</b> Client-side jsPDF lacks an embedded Telugu Unicode font; Telugu resumes are therefore printed or exported via the browser's "
        "native high-fidelity print engine.",
        style_body
    ))

    story.append(Paragraph("8.4 Conclusion", style_section_title))
    story.append(Paragraph(
        "Gramin Career Setu provides a robust, evidence-backed, and technologically modern solution to India's rural employment and career awareness divide. "
        "By synthesizing bilingual accessibility, offline-first reliability, verified opportunity navigation, and ATS resume engineering into an accessible platform, "
        "the project exemplifies how rigorous software engineering can deliver tangible social impact for rural communities.",
        style_body
    ))

    story.append(PageBreak())

    # =========================================================================
    # APPENDIX A: BASE PAPERS, GOVERNMENT PORTALS & BENCHMARKS
    # =========================================================================
    story.append(Paragraph("Appendix A: References &amp; Benchmark Projects", style_chapter_title))
    story.append(Paragraph(
        "This appendix documents official government portals, foundational literature on rural education and skilling in India, "
        "and benchmark systems reviewed during project development.",
        style_body
    ))

    ref_data = [
        [Paragraph("<b>No.</b>", style_th), Paragraph("<b>Source / System Title</b>", style_th), Paragraph("<b>Publishing Authority / Authors</b>", style_th), Paragraph("<b>Key Idea &amp; Relevance to Project</b>", style_th)],
        [Paragraph("1", style_td), Paragraph("National Career Service (NCS) Portal", style_td_bold), Paragraph("Ministry of Labour &amp; Employment, Govt of India (2024)", style_td), Paragraph("National employment portal benchmark; highlighted the necessity for offline-first rural caching and native regional languages.", style_td)],
        [Paragraph("2", style_td), Paragraph("National Education Policy (NEP 2020)", style_td_bold), Paragraph("Ministry of Education, Government of India (2020)", style_td), Paragraph("Emphasizes vocational integration, experiential learning, and regional language instruction across higher education.", style_td)],
        [Paragraph("3", style_td), Paragraph("PM Vishwakarma Scheme Guidelines", style_td_bold), Paragraph("Ministry of MSME, Government of India (2023)", style_td), Paragraph("Provides foundational framework for traditional artisans and rural self-employment opportunities cataloged in the portal.", style_td)],
        [Paragraph("4", style_td), Paragraph("Jagananna Vidya Deevena &amp; Vasathi Deevena", style_td_bold), Paragraph("Government of Andhra Pradesh (2024)", style_td), Paragraph("Benchmark state scholarship programs informing fee reimbursement eligibility modeling in the scholarships directory.", style_td)],
        [Paragraph("5", style_td), Paragraph("RIASEC Model of Vocational Personalities", style_td_bold), Paragraph("John L. Holland (American Psychological Association)", style_td), Paragraph("Theoretical framework informing the 5-question bilingual career aptitude self-assessment algorithm.", style_td)],
        [Paragraph("6", style_td), Paragraph("WCAG 2.1 Accessibility Guidelines", style_td_bold), Paragraph("World Wide Web Consortium (W3C)", style_td), Paragraph("Standards ensuring accessible color contrast, keyboard navigability, and screen-reader readiness for rural users.", style_td)]
    ]
    t_ref = Table(ref_data, colWidths=[25, 135, 145, printable_w - 305])
    t_ref.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), COLOR_PRIMARY),
        ('GRID', (0, 0), (-1, -1), 0.5, COLOR_BORDER),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [COLOR_WHITE, COLOR_BG_CARD]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
    ]))
    story.append(t_ref)

    # Build the document using the two-pass NumberedCanvas
    doc.build(story, canvasmaker=NumberedCanvas)
    
    # Copy to docs/Final_doc/reference_docs/ as well
    ref_dir = os.path.join(os.path.dirname(__file__), "docs", "Final_doc", "reference_docs")
    if os.path.exists(ref_dir):
        dest = os.path.join(ref_dir, os.path.basename(filename))
        shutil.copyfile(filename, dest)
        print(f"Copied to reference docs: {dest}")

    print(f"Project Document PDF successfully built: {filename}")


if __name__ == "__main__":
    out_pdf = "Gramin_Career_Setu_Project_Overview.pdf"
    if len(sys.argv) > 1:
        out_pdf = sys.argv[1]
    build_pdf(out_pdf)
