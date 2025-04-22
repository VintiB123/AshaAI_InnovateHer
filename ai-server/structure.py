import csv
import re

def clean_text(text):
    """Remove duplicate lines and clean up text"""
    lines = text.split('\n')
    seen = set()
    unique_lines = []
    for line in lines:
        stripped = line.strip()
        if stripped and stripped not in seen:
            seen.add(stripped)
            unique_lines.append(stripped)
    return '\n'.join(unique_lines)

def extract_field(text, field_name):
    """Extract specific field from the job description text"""
    pattern = re.compile(rf"{field_name}\s*\n(.+)", re.IGNORECASE)
    match = pattern.search(text)
    if match:
        return match.group(1).strip()
    return "Not specified"

def extract_sections(text):
    """Extract key sections from the job description"""
    sections = {
        'job_summary': '',
        'responsibilities': [],
        'requirements': []
    }
    
    paragraphs = [p.strip() for p in text.split('\n') if p.strip()]
    
    if paragraphs:
        sections['job_summary'] = paragraphs[0]
    
    current_section = None
    
    for para in paragraphs:
        if 'responsibilities:' in para.lower() or 'key responsibilities:' in para.lower():
            current_section = 'responsibilities'
            continue
        elif 'requirements:' in para.lower() or 'qualifications:' in para.lower():
            current_section = 'requirements'
            continue
            
        if current_section == 'responsibilities':
            points = re.split(r'(?<=\.)\s*(?=[A-Z])', para)
            sections['responsibilities'].extend([p.strip() for p in points if p.strip()])
        elif current_section == 'requirements':
            points = re.split(r'(?<=\.)\s*(?=[A-Z])', para)
            sections['requirements'].extend([p.strip() for p in points if p.strip()])
    
    return sections

def process_job_descriptions(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        
        fieldnames = [
            'Job Title', 'Company', 'Link', 'Location', 'Work Mode', 
            'Experience', 'Job Type', 'Industry', 'Functional Area',
            'Key Skills', 'Job Summary', 'Responsibilities', 'Requirements',
            'Company Size'
        ]
        
        with open(output_file, 'w', encoding='utf-8', newline='') as outfile:
            writer = csv.DictWriter(outfile, fieldnames=fieldnames, delimiter=',')
            writer.writeheader()
            
            for row in reader:
                clean_desc = clean_text(row['Job Description'])
                sections = extract_sections(clean_desc)
                
                # Join lists with | separator for CSV
                responsibilities = ' | '.join(sections['responsibilities']) if sections['responsibilities'] else 'Not specified'
                requirements = ' | '.join(sections['requirements']) if sections['requirements'] else 'Not specified'
                
                writer.writerow({
                    'Job Title': row['Job Title'],
                    'Company': row['Company'],
                    'Link': row['Link'],
                    'Location': extract_field(clean_desc, 'Location'),
                    'Work Mode': extract_field(clean_desc, 'Work Mode'),
                    'Experience': extract_field(clean_desc, 'Experience'),
                    'Job Type': extract_field(clean_desc, 'Job Type'),
                    'Industry': extract_field(clean_desc, 'Industry Type'),
                    'Functional Area': extract_field(clean_desc, 'Functional Area'),
                    'Key Skills': extract_field(clean_desc, 'Key Skills'),
                    'Job Summary': sections['job_summary'],
                    'Responsibilities': responsibilities,
                    'Requirements': requirements,
                    'Company Size': extract_field(clean_desc, 'Company Size')
                })

# Example usage
process_job_descriptions('job_list1.csv', 'structured_jobs.csv')