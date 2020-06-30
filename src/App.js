import React, { Component, Fragment } from "react";
import Tabela from "./Table";
import {
  NavbarBrand,
  Navbar,
  Row,
  Col,
  Label,
  Card,
  Input,
  ButtonGroup,
  Button,
  Alert
} from "reactstrap";
import { isEmptyOrNil } from "./isEmptyOrNil";
import { IsValidJSONString } from "./validateJson";
import DateTimePicker from "react-datetime-picker";
import { Charts } from "./Chart";

class App extends Component {
  state = {
    json: null,
    type: null,
    datetime: new Date("2020-4-01"),
    alert: false,
    click: {
      json: null,
      type: null
    },
    labels: []
  };

  onChangeJson = e => this.setState({ json: e.target.value });

  onDismiss = () => this.setState({ alert: false });

  onChangeType = type => this.setState({ type });

  onClick = () => {
    const { json, type } = this.state;

    if (isEmptyOrNil(json) || isEmptyOrNil(type)) {
      this.setState({ alert: "Preencher todos os campos" });
      return false;
    }

    if (!IsValidJSONString(json)) {
      this.setState({ alert: "JSON inválido" });
      return false;
    }

    this.setState({
      click: {
        json,
        type
      }
    });
  };

  showLabels = () => {
    const { json } = this.state;
    if (json !== null && IsValidJSONString(json)) {
      const trello = JSON.parse(json);

      if (!isEmptyOrNil(trello.labels)) {
        return trello.labels;
      }

      return [];
    }

    return [];
  };

  onResetScreen = () => {
    this.setState({
      click: { json: null, type: null },
      alert: null,
      type: null,
      json: null
    });
  };

  setType = type => {
    this.setState(prevState => {
      return {
        click: {
          json: prevState.click.json,
          type
        }
      };
    });
  };

  onChangeDatetime = datetime => this.setState({ datetime });

  onCheckboxBtnClick = selected => {
    const { labels } = this.state;
    const index = labels.indexOf(selected);
    if (index < 0) {
      labels.push(selected);
    } else {
      labels.splice(index, 1);
    }
    this.setState([...labels]);
  };

  render() {
    const { type, click, alert, datetime, labels } = this.state;

    if (click.type === "table") {
      return (
        <div>
          <Navbar color="info" dark>
            <NavbarBrand
              style={{ cursor: "pointer" }}
              onClick={this.onResetScreen}
            >
              Trello
            </NavbarBrand>
          </Navbar>
          <div className="container-fluid mt-1">
            <Button onClick={this.onResetScreen} color="secondary">
              {" "}
              Voltar{" "}
            </Button>
            <Button
              className="ml-1"
              color="primary"
              onClick={() => this.setType("chart")}
            >
              {" "}
              Ir para Gráficos{" "}
            </Button>
          </div>
          <Tabela
            labels={labels}
            json={click.json}
            dateTime={new Date(datetime).getTime()}
          />
        </div>
      );
    }

    if (click.type === "chart") {
      return (
        <div>
          <Navbar color="info" dark>
            <NavbarBrand
              style={{ cursor: "pointer" }}
              onClick={this.onResetScreen}
            >
              Trello
            </NavbarBrand>
          </Navbar>
          <div className="container-fluid mt-1">
            <Button onClick={this.onResetScreen} color="secondary">
              {" "}
              Voltar{" "}
            </Button>
            <Button
              className="ml-1"
              color="primary"
              onClick={() => this.setType("table")}
            >
              {" "}
              Ir para Tabelas{" "}
            </Button>
          </div>
          <Charts
            labels={labels}
            json={click.json}
            dateTime={new Date(datetime).getTime()}
          />
        </div>
      );
    }

    return (
      <div>
        <Navbar color="info" dark>
          <NavbarBrand style={{ cursor: "pointer" }}>Trello</NavbarBrand>
        </Navbar>
        <div className="mt-1">
          <Row>
            <Col xs={12} md={6} className="offset-md-3">
              <Alert color="warning" isOpen={alert} toggle={this.onDismiss}>
                {alert}
              </Alert>
              <Card body>
                <Label>Adicionar JSON: </Label>
                <Input
                  onChange={this.onChangeJson}
                  type="textarea"
                  style={{ height: "300px" }}
                />
                <Label>A partir de:</Label>
                <DateTimePicker
                  value={datetime}
                  className="react-datetime-picker"
                  onChange={this.onChangeDatetime}
                />
                <ButtonGroup className="mt-1">
                  <Button
                    color="info"
                    onClick={() => this.onChangeType("chart")}
                    active={type === "chart"}
                  >
                    Gráfico
                  </Button>
                  <Button
                    color="info"
                    onClick={() => this.onChangeType("table")}
                    active={type === "table"}
                  >
                    Tabela
                  </Button>
                </ButtonGroup>

                <div className="mt-1">
                  {!isEmptyOrNil(this.showLabels()) ? (
                    <Label>Etiquetas</Label>
                  ) : null}
                  <br />
                  {this.showLabels().map(label => (
                    <Fragment key={label.id}>
                      <Label>
                        <input
                          type="checkbox"
                          value={label.name}
                          onChange={() => this.onCheckboxBtnClick(label.name)}
                        />{" "}
                        {label.name}
                      </Label>
                      <br />
                    </Fragment>
                  ))}
                </div>

                <div className="text-right mt-1">
                  <Button onClick={this.onClick} color="success">
                    Gerar
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default App;
