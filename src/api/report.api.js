import axios from "axios";

const baseUrl = `${process.env.REACT_APP_BASE_URL}`;
const reportUrl = `${process.env.REACT_APP_BASE_URL}/report`;
const managerUrl = `${process.env.REACT_APP_BASE_URL}/manage/report`;

export default class ReportApi {
  static getAll = async (params = {}) => {
    return axios.get(`${reportUrl}`, params).then(res => res.data.result);
  };

  static getAllManager = async (params = {}) => {
    return axios.get(`${managerUrl}`, params).then(res => res.data.result);
  };

  static getAllSummary = async () => {
    return axios.get(`${reportUrl}/names`).then(res => res.data.result);
  };

  static get = async id => {
    return axios.get(`${reportUrl}/${id}`).then(res => res.data.result);
  };

  static getUserReport = async id => {
    return axios
      .get(`${reportUrl}/userReport/${id}`)
      .then(res => res.data.result);
  };

  static getDBSources = async () => {
    return axios
      .get(`${baseUrl}/datasource/getConnList`)
      .then(res => res.data.result);
    // .then(data => ({
    //   "": [],
    //   ...groupBy(data, "type")
    // }));
  };

  static update = async report => {
    return axios
      .put(`${reportUrl}/${report.id}`, report)
      .then(res => res.data.result);
  };

  static create = async report => {
    return axios.post(`${reportUrl}`, report).then(res => res.data.result);
  };

  static delete = async id => {
    return axios.delete(`${reportUrl}/${id}`).then(res => res.data.result);
  };

  static getReportBusinesses = async reportId => {
    return axios
      .get(`${reportUrl}/${reportId}/businesses`)
      .then(res => res.data.result.data);
  };

  static addReportBusiness = async (reportId, identity) => {
    return axios
      .get(`${reportUrl}/${reportId}/addBusiness?identity=${identity}`)
      .then(res => res.data.result)
      .catch(err => {
        throw new Error(err.response.data.message || "درخواست با خطا مواجه شد");
      });
  };

  static removeReportBusiness = async (reportId, userId) => {
    return axios
      .delete(`${reportUrl}/${reportId}/removeUserGroup?userId=${userId}`)
      .then(res => res.data.result.userVOList);
  };

  static reportData = async (
    id,
    filterVOS = [],
    parentParams = [],
    page,
    size
  ) => {
    const params = { page, size };
    return axios
      .post(
        `${baseUrl}/report/${id}/exec`,
        {},
        { params, headers: { "Content-Type": "application/json" } }
      )
      .then(res => res.data.result);
  };

  static publicize = async reportId => {
    return axios.get(`${reportUrl}/${reportId}/publicize`);
  };

  static unpublicize = async reportId => {
    return axios.get(`${reportUrl}/${reportId}/unpublicize`);
  };
}
