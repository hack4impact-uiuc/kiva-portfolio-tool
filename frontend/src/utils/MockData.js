const MockData = {
  missing: [
    {
      status: 'Missing',
      docClass: 'Board of Directors'
    },
    {
      status: 'Missing',
      docClass: 'Auditor Letter'
    }
  ],
  pending: [
    {
      status: 'Pending',
      docClass: 'Income Statement',
      fileName: 'income_statement.pdf',
      uploadDate: '12/4/2018'
    },
    {
      status: 'Pending',
      docClass: 'Balance Sheet',
      fileName: 'balance_sheet.pdf',
      uploadDate: '1/24/2019'
    }
  ],

  rejected: [
    {
      status: 'Rejected',
      docClass: 'Strategic Plan',
      fileName: 'strategic_plan.pdf',
      uploadDate: '12/24/2018'
    },
    {
      status: 'Rejected',
      docClass: 'Annual Plan',
      fileName: 'annual_plan.pdf',
      uploadDate: '1/3/2019'
    }
  ],
  approved: [
    {
      status: 'Approved',
      docClass: 'Financial Projections',
      fileName: 'financial_proj.pdf',
      uploadDate: '12/24/2018'
    },
    {
      status: 'Approved',
      docClass: 'Organizational Chart',
      fileName: 'org_chard.pdf',
      uploadDate: '1/23/2019'
    }
  ]
}

export default MockData
