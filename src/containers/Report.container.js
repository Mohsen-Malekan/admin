import { Container } from "unstated";
import get from "lodash/get";
import reduce from "lodash/reduce";
import Api from "../api/report.api";
import processElastic from "../util/elastic";

export class ReportContainer extends Container {
  state = {
    totalCount: 0,
    reports: [],
    dbSources: [],
    // dbTypes: [],
    allReports: []
  };

  getAll = async (params = {}, role = "ADMIN") => {
    const api = role === "ADMIN" ? Api.getAll : Api.getAllManager;
    const data = await api(params);
    await this.setState({ reports: data.data, totalCount: data.totalSize });
    return data;
  };

  getAllSummary = async () => {
    const data = await Api.getAllSummary();
    const allReports = data.map(([id, label]) => ({ id, label }));
    await this.setState({ allReports });
    return allReports;
  };

  get = async id => {
    let item = this.state.reports.find(r => r.id === id);
    if (!item) {
      item = await Api.get(id);
      const reports = [item, ...this.state.reports];
      await this.setState({ reports });
    }
    const metadata = get(item, "query.metadata", "");
    if (item.type === "FORM") {
      const { id, name, type, drillDownId, description, config, tags } = item;

      let reportConfig = "";
      try {
        reportConfig = JSON.parse(config);
      } catch (error) {
        reportConfig = { html: "", map: {} };
      }

      return {
        id,
        name,
        tags,
        description,
        type,
        drillDownId,
        config: reportConfig.html,
        children: reportConfig.map
      };
    } else if (typeof metadata === "string") {
      try {
        item.query.metadata = JSON.parse(item.query.metadata);
      } catch (error) {
        item.query.metadata = { default_order: "", template: "" };
      }
    }
    return item;
  };

  getDBSources = async () => {
    const dbSources = await Api.getDBSources();
    // const dbTypes = Object.keys(dbSources);
    return this.setState({ dbSources });
  };

  save = async values => {
    const {
      id,
      name,
      type,
      indexName,
      dataSourceId,
      drillDownId = -1,
      query,
      metadata,
      params: queryParams,
      filters: queryFilters,
      columns: queryColumns,
      description,
      config,
      tags
    } = values;

    const report = {
      id,
      name,
      type,
      drillDownId: drillDownId,
      description,
      query: {
        query,
        metadata: JSON.stringify(
          metadata || { default_order: "", template: "" }
        ),
        dataSource: { id: dataSourceId },
        indexName,
        queryParams,
        queryFilters,
        queryColumns
      },
      config,
      tags: tags
        .trim()
        .split(" ")
        .join(",")
    };

    if (id > 0) {
      await Api.update(report);
      const reports = this.state.reports.map(r => {
        if (report.id === r.id) {
          return {
            ...r,
            ...report
          };
        }
        return r;
      });
      return this.setState({ reports });
    }
    const newReportId = await Api.create(report);
    return this.get(newReportId);
  };

  saveComposite = async data => {
    const {
      id,
      name,
      tags,
      description,
      type,
      drillDownId,
      config,
      children
    } = data;

    const report = {
      id,
      name,
      type,
      drillDownId,
      description,
      config: JSON.stringify({
        html: config,
        map: { ...children }
      }),
      tags,
      compositeSubReports: reduce(
        children,
        (res, value) => [...res, { id: value }],
        []
      )
    };

    if (id > 0) {
      await Api.update(report);
      const reports = this.state.reports.map(r => {
        if (report.id === r.id) {
          return {
            ...r,
            ...report
          };
        }
        return r;
      });
      return this.setState({ reports });
    }

    const newReportId = await Api.create(report);
    return this.get(newReportId);
  };

  delete = async id => {
    await Api.delete(id);
    const reports = this.state.reports.filter(r => r.id !== id);
    return this.setState({ reports, totalCount: this.state.totalCount - 1 });
  };

  reportData = async (
    reportId,
    filters = [],
    params = [],
    page = 0,
    size = 0
  ) => {
    // const report = this.state.reports.find(r => r.id === +reportId);
    const report = await this.get(+reportId);

    if (!!report) {
      return Api.reportData(reportId, filters, params, page, size).then(
        data => {
          if (report.query.dataSource.type === "ELASTICSEARCH") {
            const template = get(report.query.metadata, "template", "");
            return processElastic(JSON.parse(data.rawData), template);
          }
          return data;
        }
      );
    }
    return Promise.reject("report doesn't exist");
  };

  publicize = async reportId => {
    return Api.publicize(reportId);
  };

  unpublicize = async reportId => {
    return Api.unpublicize(reportId);
  };
}

const container = new ReportContainer();

export default container;
