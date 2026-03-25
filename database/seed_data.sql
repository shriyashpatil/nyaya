-- ============================================================
-- Maharashtra RERA Rules - Seed Data
-- Based on Maharashtra Real Estate (Regulation & Development) Rules 2017
-- ============================================================

INSERT INTO rera_rules (rule_id, state, title, description, penalty, documents_required, timeline, source_reference) VALUES

-- Registration Rules
('RERA_MH_001', 'Maharashtra', 'Mandatory Project Registration',
 'Every promoter shall register the real estate project with MahaRERA before making any advertisement, marketing, booking, selling, or offering for sale any plot, apartment, or building in a project where the land area exceeds 500 square meters or the number of apartments exceeds 8.',
 'Up to 10% of the estimated cost of the real estate project for first offence; imprisonment up to 3 years for continued violation.',
 'Form A - Application; Authenticated copy of title deed; Sanctioned building plan; Layout plan; Land use certificate; Environmental clearance (if applicable); Commencement certificate; Architect certificate for area',
 '30 days before advertising or booking; Renewal required before expiry',
 'Section 3, Maharashtra RERA Rules 2017'),

('RERA_MH_002', 'Maharashtra', 'Promoter Registration',
 'Every promoter shall register themselves with MahaRERA. Individual promoters and companies, LLPs, or societies acting as promoters must obtain a unique promoter registration number before undertaking any real estate project.',
 'Penalty up to Rs. 10,000 per day for non-registration; Maximum 5% of project cost.',
 'PAN card; Aadhaar card or passport; Income tax returns (last 3 years); Bank statements; Company registration documents (for entities); GST registration',
 'Before commencement of any real estate project activity',
 'Section 4, Maharashtra RERA Rules 2017'),

('RERA_MH_003', 'Maharashtra', 'Quarterly Progress Report Submission',
 'The promoter shall submit quarterly reports on MahaRERA portal updating project status including: number of bookings, financial details, construction progress, structural certificates, occupancy updates, and any changes to original sanctioned plan.',
 'Rs. 10,000 per day for each day of delay; Total penalty may extend to 5% of project cost.',
 'Quarterly progress report in prescribed format; Architect certificate; Financial statements; Updated RERA project page',
 'Within 7 days of end of each quarter (30th April, 31st July, 31st October, 31st January)',
 'Rule 5, Maharashtra RERA Rules 2017'),

-- Financial Compliance
('RERA_MH_004', 'Maharashtra', 'Escrow Account Obligation (70% Deposit)',
 'The promoter shall deposit 70% of the amounts realised from allottees from time to time in a separate escrow account in a scheduled bank maintained specifically for the project. These funds can only be withdrawn in proportion to the completion of the project after certification from an engineer and chartered accountant.',
 'Penalty up to 5% of project cost; Criminal liability may be invoked for fraudulent withdrawal.',
 'Escrow account opening documents; Bank agreement; CA certification for withdrawal; Architect/Engineer certificate of completion percentage',
 'Escrow account must be opened before first booking; Withdrawals only after due certification',
 'Section 4(2)(l), Maharashtra RERA Rules 2017'),

('RERA_MH_005', 'Maharashtra', 'Separate Account for Each Project',
 'Where a promoter has multiple real estate projects, a separate bank account and escrow account must be maintained for each project. Funds collected from allottees of Project A cannot be used for Project B under any circumstances.',
 'Up to Rs. 50 lakh fine; Imprisonment up to 1 year for fraudulent commingling of funds.',
 'Separate bank account statements; Auditor certificate of separate fund maintenance',
 'Maintained throughout project duration',
 'Rule 4, Maharashtra RERA Rules 2017'),

('RERA_MH_006', 'Maharashtra', 'Annual Audit and Financial Disclosure',
 'Promoters must get project accounts audited annually by a chartered accountant and submit the audited statement to MahaRERA within 6 months of the end of every financial year. The audit must certify proper utilization of funds.',
 'Rs. 5,000 per day of delay; Maximum penalty Rs. 5 lakh.',
 'Audited financial statements; CA audit report; Escrow account statements; Certificate of utilization of funds',
 'Within 6 months of financial year end (i.e., by 30th September each year)',
 'Rule 5(4), Maharashtra RERA Rules 2017'),

-- Construction & Delivery
('RERA_MH_007', 'Maharashtra', 'Structural Defect Warranty (5 Years)',
 'The promoter shall be responsible for any structural defect or any defect in workmanship, quality, or provision of services and facilities in the apartment or common areas for a period of 5 years from the date of possession. The promoter must rectify defects reported by allottees within 30 days at no cost.',
 'Compensation equal to cost of repair; Interest on delayed rectification; Allottee entitled to refund with interest if defects not remedied.',
 'Structural stability certificate from licensed structural engineer; Completion certificate; Possession letter',
 '5 years from date of handing over possession',
 'Section 14(3), RERA Act 2016'),

('RERA_MH_008', 'Maharashtra', 'Possession Timeline and Compensation',
 'The promoter must deliver possession of the apartment or plot as per the date agreed to in the sale agreement. In case of delay, the promoter is liable to pay interest at SBI MCLR + 2% per annum for every month of delay to each allottee. Allottees can also claim full refund with interest.',
 'Interest at SBI MCLR + 2% per annum on the amount paid by allottee for the period of delay; Refund with interest if allottee opts out.',
 'Sale agreement with agreed possession date; Completion certificate from competent authority; Occupancy certificate',
 'As per agreement; Maximum force majeure extension possible with prior MahaRERA approval',
 'Section 18, RERA Act 2016'),

-- Disclosure Requirements
('RERA_MH_009', 'Maharashtra', 'Website Disclosure Obligations',
 'Every promoter shall create a web page on the MahaRERA website for each registered project and update it quarterly. The page must display: registration number, project details, booking status, floor plans, layout plans, and progress photos.',
 'Rs. 10,000 per day for non-disclosure or incomplete information; Maximum Rs. 50,000.',
 'Project registration documents; Updated floor plans; Sanction orders; Progress photos (minimum 4 per quarter)',
 'Within 15 days of registration; Updated every quarter',
 'Section 11, RERA Act 2016; Rule 4, Maharashtra RERA Rules 2017'),

('RERA_MH_010', 'Maharashtra', 'Sale Agreement Standardization',
 'All sale agreements must be in the format prescribed by MahaRERA. The agreement must clearly state: carpet area (not super built-up area), possession date, specifications, payment schedule, and consequences of delay. Promoters cannot use their own format.',
 'Agreements not in prescribed format are voidable at allottee discretion; Penalty up to Rs. 10,000.',
 'Draft sale agreement; Carpet area calculation sheet; Payment schedule; Specification sheet',
 'Before accepting any advance payment exceeding 10% of apartment cost',
 'Section 13, RERA Act 2016; Maharashtra RERA (Agreement for Sale) Rules 2017'),

-- Marketing Compliance
('RERA_MH_011', 'Maharashtra', 'Advertising with RERA Number',
 'No promoter shall advertise, market, or sell any apartment, plot, or building without including the MahaRERA registration number and QR code in all advertisements including hoardings, social media, brochures, emails, and websites.',
 'Rs. 10,000 per advertisement violation; Removal of advertisement at promoter cost.',
 'MahaRERA registration certificate with QR code; Proof of project registration',
 'All marketing materials from date of project registration',
 'Section 11(2), RERA Act 2016'),

('RERA_MH_012', 'Maharashtra', 'No Collection Before Registration',
 'A promoter shall not accept any advance, application fee, deposit, or payment exceeding 10% of the apartment price before the allottee has signed the agreement for sale and the project is duly registered with MahaRERA.',
 'Penalty up to 5% of project cost; Imprisonment up to 1 year for repeated violations.',
 'MahaRERA project registration certificate; Approved agreement for sale format',
 'Strictly before any booking or advance collection beyond 10%',
 'Section 13(1), RERA Act 2016'),

-- Allottee Rights
('RERA_MH_013', 'Maharashtra', 'Carpet Area Disclosure Mandate',
 'Promoters must sell apartments only on the basis of carpet area as defined under RERA. The carpet area must be disclosed in all advertisements, brochures, and sale agreements. Charges for common areas must be disclosed separately and cannot be included in the carpet area calculation.',
 'Penalty proportional to excess charges collected; Refund of excess amount with interest.',
 'Architect certificate of carpet area; Layout plan showing carpet area calculation',
 'In all advertisements and sale documents from date of RERA registration',
 'Section 4(2)(d), RERA Act 2016'),

('RERA_MH_014', 'Maharashtra', 'Project Alteration Restrictions',
 'The promoter shall not make any changes to the sanctioned plans, layout plans, or specifications and amenities provided to allottees without the written consent of at least 2/3rd of allottees and prior permission from MahaRERA. Minor alterations within individual apartments are allowed with individual allottee consent.',
 'Penalty up to 5% of project cost; Restoration at promoter cost if changes are unauthorized.',
 'Consent letters from 2/3rd allottees; Revised sanction plan; MahaRERA approval letter',
 'Before implementation of any changes; Minimum 30-day notice to allottees',
 'Section 14(2), RERA Act 2016'),

('RERA_MH_015', 'Maharashtra', 'Conveyance Deed within 3 Months of OC',
 'The promoter must execute and register the conveyance deed of the apartment in favor of the allottee within 3 months of obtaining the occupancy certificate (OC) from the competent authority, or within the period specified in the sale agreement, whichever is earlier.',
 'Penalty of 5% of property value for delay; Allottee may seek specific performance in RERA tribunal.',
 'Occupancy certificate; Property title documents; Sale agreement; Stamp duty payment receipts',
 'Within 3 months of obtaining Occupancy Certificate',
 'Section 17, RERA Act 2016');

-- ============================================================
-- Verify data
-- ============================================================
-- SELECT COUNT(*) FROM rera_rules WHERE state = 'Maharashtra';
-- Expected: 15 rows
