import { Container } from "unstated";
import { pick } from "lodash";

const TAB0 = [
  "name",
  "source",
  "indexName",
  "dataSource",
  "drillDownId",
  "description",
  "tags"
];
const TAB1 = ["type", "chartType"];
const TAB2 = ["query", "params", "columns"];
const TAB3 = ["filters"];
const TAB4 = ["config"];

const TABS = {
  0: TAB0,
  1: TAB1,
  2: TAB2,
  3: TAB3,
  4: TAB4
};

const configString = '{"refreshInterval":0}';

export class EditReportContainer extends Container {
  state = {
    report: {
      id: 0,
      name: "",
      source: "",
      indexName: "",
      dataSource: "",
      drillDownId: "",
      description: "",
      type: "Table",
      chartType: "Simple",
      query: "",
      params: [],
      filters: [],
      columns: [],
      config: configString,
      tags: ""
    },
    tab: 0
  };

  initializeReport = async report => {
    const {
      id,
      name,
      type,
      chartType,
      source,
      query: queryInfo,
      drillDownId = "",
      description,
      config = configString,
      tags = ""
    } = report;

    const {
      dataSource,
      indexName = "",
      query,
      queryParams: params,
      queryFilters: filters,
      queryColumns: columns
    } = queryInfo;

    return this.setState({
      report: {
        id,
        name,
        source,
        indexName,
        dataSource,
        drillDownId,
        description,
        type,
        chartType,
        query,
        params,
        filters,
        columns,
        config,
        tags: tags.split(",").join(" ")
      }
    });
  };

  setReport = async data => {
    const report = { ...this.state.report, ...data };
    return this.setState({ report });
  };

  resetReport = async () => {
    return this.setState({
      report: {
        id: 0,
        name: "",
        source: "",
        indexName: "",
        dataSource: "",
        drillDownId: "",
        description: "",
        type: "Table",
        chartType: "Simple",
        query: "",
        params: [],
        filters: [],
        columns: [],
        config: configString,
        tags: ""
      },
      tab: 0
    });
  };

  setTab = async tab => {
    return this.setState({ tab });
  };

  getReport = () => {
    return pick(this.state.report, TABS[this.state.tab]);
  };
}

const container = new EditReportContainer();

export default container;