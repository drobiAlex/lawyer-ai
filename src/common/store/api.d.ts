export type CompanyOrgFormType = {
  name: string;
  value: string;
};

export type CompanyOrgForm = {
  id: number;
  created: string;
  modified: string;
  name: string;
  jurisdiction: {
    id: number;
    created: string;
    modified: string;
    country: string;
    active: boolean;
    currency: string;
  };
  members: {
    lower: number;
    upper: number | null;
    bounds: string;
  };
  shares: {
    lower: number;
    upper: number;
    bounds: string;
  };
  shares_capital: string;
  organization_type: string;
};
