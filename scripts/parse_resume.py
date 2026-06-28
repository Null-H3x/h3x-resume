#!/usr/bin/env python3
"""Parse Resume.docx into data/resume.json for the H3x-Resume site."""

from __future__ import annotations

import json
import re
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOCX = ROOT / "Resume.docx"
OUT = ROOT / "data" / "resume.json"
W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

SKILL_CATEGORY_HEADERS = {
    "network engineering & systems administration",
    "telecommunications engineering",
    "infrastructure & administration",
    "cybersecurity / ethical hacking",
    "collaboration & communication tools",
}

MONTHS = (
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
)


def read_paragraphs(path: Path) -> list[str]:
    with zipfile.ZipFile(path) as zf:
        root = ET.fromstring(zf.read("word/document.xml"))
    paras: list[str] = []
    for p in root.iter(W + "p"):
        text = "".join(t.text for t in p.iter(W + "t") if t.text)
        if text.strip():
            paras.append(text.strip())
    return paras


def is_heading(line: str) -> bool:
    upper = line.upper()
    return upper in {
        "OBJECTIVE", "EDUCATION", "CERTIFICATIONS", "COMMUNICATION",
        "LEADERSHIP", "EXPERIENCE", "TECHNICAL PROFICIENCIES",
    } or line.lower() == "certifications"


def parse_contact(line: str) -> tuple[str, str]:
    phone, email = "", ""
    if "|" in line:
        left, right = line.split("|", 1)
        phone = left.strip()
        email = right.strip()
    return phone, email


def parse_cert_line(line: str) -> dict[str, str]:
    for month in MONTHS:
        idx = line.rfind(month)
        if idx != -1:
            raw = line[:idx].strip(" –-")
            date = line[idx:].strip()
            if raw.upper().startswith("SEC+"):
                return {
                    "name": "SEC+ — CompTIA Security+",
                    "issuer": "CompTIA",
                    "year": date,
                }
            name, issuer = raw, ""
            if " - " in raw:
                name, issuer = raw.split(" - ", 1)
                name, issuer = name.strip(), issuer.strip()
            elif "Google" in raw:
                issuer = "Google"
                name = raw
            elif "CEH" in raw.upper():
                issuer = "EC-Council"
                name = "CEH — Certified Ethical Hacker"
            return {"name": name, "issuer": issuer, "year": date}
    return {"name": line, "issuer": "", "year": ""}


def parse_tenure_line(line: str) -> dict[str, str] | None:
    m = re.match(r"^(\d+)\s+years?\s+(.+)$", line, re.I)
    if not m:
        return None
    return {"years": m.group(1), "label": m.group(2).strip()}


def parse_experience_header(line: str) -> tuple[str, str, str, str]:
    """U.S. Army | USA, Europe, AsiaOCT 2009 – Current"""
    company, location, period = line, "", ""
    if "|" in line:
        company_part, rest = line.split("|", 1)
        company = company_part.strip()
        rest = rest.strip()
        m = re.search(
            r"^(.*?)((" + "|".join(MONTHS) + r")\s*\d{4}\s*[–—-]\s*Current)$",
            rest,
            re.I,
        )
        if m:
            location = m.group(1).strip()
            period = m.group(2).strip()
        else:
            location = rest
    return company, location, period


def parse_skills(lines: list[str]) -> list[dict[str, list[str]]]:
    blocks: list[dict[str, list[str]]] = []
    current_name = "RISK, GOVERNANCE & COMPLIANCE"
    current_items: list[str] = []

    def flush() -> None:
        nonlocal current_items
        if current_items:
            blocks.append({
                "category": current_name.upper(),
                "items": current_items[:],
            })
            current_items = []

    for line in lines:
        key = line.lower()
        if key in SKILL_CATEGORY_HEADERS:
            flush()
            current_name = line
        else:
            current_items.append(line)
    flush()
    return blocks


def build_json(paras: list[str]) -> dict:
    data: dict = {
        "profile": {},
        "stats": [],
        "about": "",
        "leadership": "",
        "communication": "",
        "terminalIntro": [],
        "experienceSummary": [],
        "experienceHours": "",
        "experience": [],
        "skills": [],
        "certifications": [],
        "education": [],
    }

    i = 0
    n = len(paras)

    # Header: name, title, contact
    data["profile"]["name"] = paras[i]; i += 1
    data["profile"]["title"] = paras[i]; i += 1
    phone, email = parse_contact(paras[i]); i += 1
    data["profile"]["phone"] = phone
    data["profile"]["email"] = email
    data["profile"]["handle"] = "".join(p[0] for p in data["profile"]["name"].split()[:2]).upper()
    data["profile"]["tagline"] = "// CYBERSECURITY · NETWORK ENGINEERING · TELECOMMUNICATIONS //"
    data["profile"]["availability"] = "Open to opportunities"
    data["profile"]["links"] = [
        {"label": "Email", "url": f"mailto:{email}", "icon": "✉"},
        {"label": "GitHub", "url": "https://github.com/Null-H3x", "icon": "◈"},
    ]

    sections: dict[str, list[str]] = {}
    current = None
    while i < n:
        line = paras[i]
        if is_heading(line):
            current = line.upper()
            if current == "CERTIFICATIONS":
                current = "CERTIFICATIONS"
            sections[current] = []
            i += 1
            continue
        if current:
            sections[current].append(line)
        i += 1

    data["about"] = " ".join(sections.get("OBJECTIVE", []))

    # Education
    edu_lines = sections.get("EDUCATION", [])
    if len(edu_lines) >= 2:
        degree = edu_lines[0]
        school_line = edu_lines[1]
        school, location, year = school_line, "", ""
        if "|" in school_line:
            school, rest = school_line.split("|", 1)
            school = school.strip()
            rest = rest.strip()
            m = re.search(r"(\d{4})$", rest)
            if m:
                year = m.group(1)
                location = rest[: m.start()].strip()
            else:
                location = rest
        data["education"].append({
            "degree": degree,
            "school": school,
            "period": year,
            "notes": location,
        })

    data["certifications"] = [
        parse_cert_line(line) for line in sections.get("CERTIFICATIONS", [])
    ]

    comm = sections.get("COMMUNICATION", [])
    data["communication"] = " ".join(comm) if comm else ""

    lead = sections.get("LEADERSHIP", [])
    data["leadership"] = " ".join(lead) if lead else ""

    # Experience
    exp_lines = sections.get("EXPERIENCE", [])
    hours_note = ""
    tenure: list[dict[str, str]] = []
    role = company = location = period = mos = ""
    highlights: list[str] = []
    idx = 0

    if exp_lines and "hours per week" in exp_lines[0].lower():
        hours_note = exp_lines[0]
        idx = 1

    while idx < len(exp_lines):
        line = exp_lines[idx]
        t = parse_tenure_line(line)
        if t:
            tenure.append(t)
            idx += 1
            continue
        if line.startswith("Communications Architect"):
            role = line
            idx += 1
            continue
        if line.startswith("U.S. Army"):
            company, location, period = parse_experience_header(line)
            data["profile"]["location"] = location or "United States"
            idx += 1
            continue
        if line.startswith("MOS:"):
            mos = line
            idx += 1
            continue
        highlights.append(line)
        idx += 1

    data["experienceSummary"] = tenure
    data["experienceHours"] = hours_note
    data["experience"].append({
        "role": role,
        "company": company,
        "period": period,
        "location": location,
        "mos": mos,
        "hours": hours_note,
        "summary": mos,
        "highlights": highlights,
        "tags": ["25E", "94E", "SIEM", "Active Directory", "Splunk", "Nessus"],
    })

    data["skills"] = parse_skills(sections.get("TECHNICAL PROFICIENCIES", []))

    # Stats derived from parsed content
    mil_years = next((t["years"] for t in tenure if "customer service" in t["label"].lower()), "16")
    data["stats"] = [
        {"label": "MILITARY SERVICE", "value": f"{mil_years}+", "color": "cyan"},
        {"label": "CERTIFICATIONS", "value": str(len(data["certifications"])), "color": "violet"},
        {"label": "SYSTEMS MANAGED", "value": "5K+", "color": "green"},
        {"label": "SIEM COVERAGE", "value": "4K+", "color": "orange"},
    ]

    name = data["profile"]["name"]
    certs = " · ".join(c["name"].split("—")[0].strip() for c in data["certifications"][:3])
    data["terminalIntro"] = [
        "[H3x-Resume] Initializing profile module...",
        f"[*] Operator: {name}",
        f"[*] Credentials: {certs}",
        "[*] Scope: authorized environments only",
        "[*] Pipeline: RECON → ENUM → VALIDATE → REPORT",
        "[H3x-Resume] Ready. Scroll or use sidebar to navigate.",
    ]

    return data


def main() -> None:
    if not DOCX.exists():
        raise SystemExit(f"Missing {DOCX}")
    paras = read_paragraphs(DOCX)
    data = build_json(paras)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {OUT} ({len(paras)} paragraphs parsed)")


if __name__ == "__main__":
    main()
