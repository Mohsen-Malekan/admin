import React, { Component } from "react";
import { Formik, Form } from "formik";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Input from "../../../components/FormikInputs";
import ReportContainer from "../../../containers/Report.container";
import EditContainer from "./EditReport.container";
import AutoSuggest from "./AutoSuggest";

const REPORT_TYPES = [
  { name: "Table", value: "TABLE" },
  { name: "Scalar", value: "SCALAR" },
  { name: "Line Chart", value: "LINE" },
  { name: "Area Chart", value: "AREA" },
  { name: "Bar Chart", value: "BAR" },
  { name: "Scatter Chart", value: "SCATTER" },
  { name: "Pie Chart", value: "PIE" },
  { name: "Gauge Chart", value: "GAUGE" },
  { name: "Heatmap Chart", value: "HEATMAP" },
  { name: "Treemap Chart", value: "TREEMAP" },
  { name: "Radar Chart", value: "RADAR" }
];

class ReportBasicForm extends Component {
  componentDidMount = () => {
    document.getElementById("mainPanel").scrollTop = 0;
  };

  submit = async (values, { resetForm }) => {
    const initialValues = EditContainer.getReport();
    resetForm(initialValues);
    await EditContainer.setReport(values);
    await EditContainer.setTab(1);
  };

  validate = values => {
    let errors = {};
    if (!values.name) {
      errors.name = "نام را وارد کنید";
    }
    if (!values.type) {
      errors.type = "نوع گزارش را انتخاب نمایید";
    }
    if (!values.dataSourceId) {
      errors.dataSourceId = "اتصال دیتابیس را انتخاب نمایید";
    }
    if (values.description && values.description.length > 200) {
      errors.description = "کمتر از 200 حرف مجاز میباشد";
    }
    return errors;
  };

  getDBType = id => {
    const db = ReportContainer.state.dbSources.find(db => db.id === id);
    return !!db ? db.type : "";
  };

  renderForm = props => {
    const { values } = props;
    const { dbSources } = ReportContainer.state;
    return (
      <Form autoComplete="off">
        <Grid container>
          <Grid item xs={12} sm={12} md={12}>
            <Grid container>
              <Grid item xs={12} sm={12} md={3}>
                <Input name="name" label="نام" {...props} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Input select name="type" label="نوع گزارش" {...props}>
                  {REPORT_TYPES.map(rt => (
                    <MenuItem value={rt.value} key={rt.value}>
                      {rt.name}
                    </MenuItem>
                  ))}
                </Input>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Input
                  select
                  name="dataSourceId"
                  label="اتصال دیتابیس"
                  {...props}
                >
                  {dbSources.length > 0 ? (
                    dbSources.map(({ id, name, type }) => (
                      <MenuItem value={id} key={id}>
                        {name} ({type})
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="">نوع دیتابیس را انتخاب کنید</MenuItem>
                  )}
                </Input>
              </Grid>
              {this.getDBType(values.dataSourceId) === "ELASTICSEARCH" && (
                <Grid item xs={12} sm={12} md={3}>
                  <Input
                    name="indexName"
                    label="نام ایندکس"
                    style={{ direction: "ltr" }}
                    {...props}
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={6} md={3}>
                <AutoSuggest
                  name="drillDownId"
                  label="گزارش تکمیلی"
                  placeholder="قسمتی از نام گزارش را تایپ کنید"
                  formikProps={{ ...props }}
                  suggestions={this.props.suggestions}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <Input
                  multiline
                  name="description"
                  label="توضیحات"
                  {...props}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <Input
                  multiline
                  name="tags"
                  label=" تگ های گزارش را با فاصله وارد کنید"
                  {...props}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={12}>
            <br />
            <br />
            <Button type="submit" variant="contained" color="primary">
              بعدی
            </Button>
          </Grid>
        </Grid>
      </Form>
    );
  };

  render = () => {
    const initialValues = EditContainer.getReport();
    return (
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validate={this.validate}
        onSubmit={this.submit}
        render={this.renderForm}
      />
    );
  };
}

export default ReportBasicForm;
