export const customerUrl = (companyId) => {
  return `https://crm.iqmetrix.net/v1/Companies(${companyId})/Customers`;
};
export const catalogUrl = (companyId) => {
  return `https://api.covasoft.net/catalogs/v1/Companies(${companyId})/Catalog/Items`;
};
export const catalogDetailUrl = ({ companyId, catalogId }) => {
  return `https://api.covasoft.net/catalogs/v1/Companies(${companyId})/Catalog/Items(${catalogId})/ProductDetails`;
};
