import React, { Component } from "react";
import get from "lodash/get";
import moment from "moment-jalaali";
import PerfectScrollbar from "perfect-scrollbar";
import { withStyles } from "@material-ui/core/styles";
import { withSize } from "react-sizeme";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import CircularProgress from "@material-ui/core/CircularProgress";
import TableActions from "./TableActions";

const styles = theme => {
  return {
    root: {
      width: "100%",
      overflow: "auto"
      // marginTop: theme.spacing.unit * 3
      // minWidth: 400,
    },
    table: {},
    header: {
      backgroundColor: "#4c4b4b"
    },
    nowrap: {
      whiteSpace: "nowrap"
    }
  };
};

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.grey["800"],
    fontSize: "11px"
  }
}))(TableCell);

class CustomTable extends Component {
  componentDidMount = () => {
    this.ps = new PerfectScrollbar(this.refs.tableWrapper);
  };

  handleChangePage = (_, page) => {
    this.props.onChangePage && this.props.onChangePage(page);
  };

  handleChangeRowsPerPage = event => {
    this.props.onChangePageSize &&
      this.props.onChangePageSize(+event.target.value);
  };

  handleAction = (action, item) => {
    this.props.onAction && this.props.onAction(action, item);
  };

  getData = (col, item) => {
    const data = get(item, col.path);
    if (col.type === "DATE") {
      return moment(data.slice(0, -5)).format("jYYYY/jMM/jDD");
    }
    return data;
  };

  render() {
    const {
      cols,
      rows,
      count,
      rowsPerPage = 10,
      page = 0,
      loading,
      ActionsComponent,
      aspect = 0,
      height = 0,
      classes
    } = this.props;

    const { width } = this.props.size;

    const emptyRows = 0;
    // rowsPerPage - Math.min(rowsPerPage, count - page * rowsPerPage);

    const tableStyle = {
      height: aspect ? width / aspect : height || "fit-content"
    };

    const colSpan = ActionsComponent ? cols.length + 1 : cols.length;

    return (
      <div
        id="table-wrapper"
        className={classes.root}
        style={tableStyle}
        ref="tableWrapper"
      >
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {cols.map((col, key) => (
                <CustomTableCell key={key}>{col.key}</CustomTableCell>
              ))}
              {rows.length > 0 && ActionsComponent && <CustomTableCell />}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={colSpan} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : rows.length ? (
              (rows.length > rowsPerPage
                ? rows.slice(0, rowsPerPage)
                : rows
              ).map((item, key) => (
                <TableRow hover key={key}>
                  {cols.map((col, i) => (
                    <TableCell key={i}>{this.getData(col, item)}</TableCell>
                  ))}
                  {ActionsComponent && (
                    <TableCell align="right" className={classes.nowrap}>
                      <ActionsComponent
                        onAction={action => this.handleAction(action, item)}
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={colSpan}>
                  داده ای برای نمایش وجود ندارد
                </TableCell>
              </TableRow>
            )}
            {rows.length > 0 && emptyRows > 0 && (
              <TableRow style={{ height: 48 * emptyRows }}>
                <TableCell colSpan={colSpan} />
              </TableRow>
            )}
          </TableBody>
          {rows.length > 0 && (
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 50]}
                  colSpan={colSpan}
                  count={count}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    native: true
                  }}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  labelRowsPerPage="تعداد در صفحه"
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}-${to} از ${count}`
                  }
                  ActionsComponent={TableActions}
                />
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>
    );
  }
}

const WithSize = withSize()(CustomTable);

export default withStyles(styles)(WithSize);
