

export class CKANClient {
  private baseUrl: string;

  constructor(baseUrl: string = "https://data.gov.ua") {
    this.baseUrl = baseUrl;
  }

  async packageSearch(query: string = "", rows: number = 10, start: number = 0) {
    const url = new URL(`${this.baseUrl}/api/3/action/package_search`);
    if (query) url.searchParams.append("q", query);
    url.searchParams.append("rows", rows.toString());
    url.searchParams.append("start", start.toString());

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`CKAN package_search failed: ${response.statusText}`);
    const data = await response.json();
    return data;
  }

  async packageShow(id: string) {
    const response = await fetch(`${this.baseUrl}/api/3/action/package_show?id=${id}`);
    if (!response.ok) throw new Error(`CKAN package_show failed: ${response.statusText}`);
    return await response.json();
  }

  async resourceShow(id: string) {
    const response = await fetch(`${this.baseUrl}/api/3/action/resource_show?id=${id}`);
    if (!response.ok) throw new Error(`CKAN resource_show failed: ${response.statusText}`);
    return await response.json();
  }

  async datastoreSearch(resourceId: string, limit: number = 100, offset: number = 0, q?: string) {
    const url = new URL(`${this.baseUrl}/api/3/action/datastore_search`);
    url.searchParams.append("resource_id", resourceId);
    url.searchParams.append("limit", limit.toString());
    url.searchParams.append("offset", offset.toString());
    if (q) url.searchParams.append("q", q);

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`CKAN datastore_search failed: ${response.statusText}`);
    return await response.json();
  }

  async datastoreSearchSql(sql: string) {
    const url = new URL(`${this.baseUrl}/api/3/action/datastore_search_sql`);
    url.searchParams.append("sql", sql);

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`CKAN datastore_search_sql failed: ${response.statusText}`);
    return await response.json();
  }
}
