export const customerUrl = (companyId) => {
  return `https://crm.iqmetrix.net/v1/Companies(${companyId})/Customers`;
};
export const customerDetailsUrl = ({ companyId, customerId }) => {
  return `https://crm.iqmetrix.net/v1/Companies(${companyId})/CustomerFull(${customerId})`;
};
export const catalogUrl = (companyId) => {
  return `https://api.covasoft.net/catalogs/v1/Companies(${companyId})/Catalog/Items`;
};

export const catalogDetailUrl = ({ companyId, catalogId }) => {
  return `https://api.covasoft.net/catalogs/v1/Companies(${companyId})/Catalog/Items(${catalogId})/ProductDetails`;
};

export const customerOrderSummaryUrl = ({ companyId, customerId }) => {
  return `https://api.covasoft.net/pointofsale/Companies(${companyId})/SalesInvoiceSummaries?$filter=CustomerId eq guid'${customerId}'`;
};

export const customerOrderSummaryDetailUrl = ({ companyId, invoiceId }) => {
  return `https://api.covasoft.net/pointofsale/Companies(${companyId})/SalesInvoiceDetails(${invoiceId})`;
};
