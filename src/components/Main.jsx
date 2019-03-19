import React, { Component } from "react";
import { SnackbarProvider } from "notistack";
import Typography from "@material-ui/core/Typography";
import Page from "./Page/Page";

class Main extends Component {
  state = {
    error: "",
    loading: false
  };

  componentDidMount = async () => {
    await this.loadInitilData();
  };

  loadInitilData = async () => {
    try {
      // this.setState({ loading: true });
      // console.log("MAIN.loadInitilData...");
      // await AuthContainer.fetchUser();
      // this.setState({ loading: false });
    } catch (error) {
      this.setState({ loading: false, error });
    }
  };

  // static getDerivedStateFromError(error) {
  //   return { error };
  // }

  componentDidCatch(error, info) {
    this.setState({ error });
  }

  render = () => {
    const { error } = this.state;
    if (error) {
      return (
        <Page>
          <Typography color="error" variant="h3" gutterBottom>
            خطا
          </Typography>
          <Typography color="error" variant="h5" gutterBottom>
            {error.message || error || "خطا"}
          </Typography>
        </Page>
      );
    }
    // if (loading) {
    //   return <Loading />;
    // }

    return (
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
        autoHideDuration={2000}
      >
        <>{this.props.children}</>
      </SnackbarProvider>
    );
  };
}

export default Main;