import React, { Component } from "react";
import Chart from "react-google-charts";
import { Row, Col } from "reactstrap";
import { isEmptyOrNil } from "./isEmptyOrNil";

function sortByCol(arr, colIndex) {
  arr.sort(sortFunction);
  function sortFunction(a, b) {
    a = a[colIndex];
    b = b[colIndex];
    return a === b ? 0 : a < b ? -1 : 1;
  }
}

export class Charts extends Component {
  state = {
    pieChart: [],
    barChart: [],
    barChart2: [],
    trello: []
  };

  componentDidMount = () => {
    const trello = JSON.parse(this.props.json);
    this.barChartLoad(trello);
    this.barChartLoad2(trello);
    this.pieChartLoad(trello);
    this.setState({
      trello
    });
  };

  pieChartLoad = trello => {
    const { dateTime, labels } = this.props;

    const complete = trello.cards.filter(card => {
      if (!isEmptyOrNil(labels)) {
        return (
          card.dueComplete &&
          parseInt(card.id.substring(0, 8), 16) >
            dateTime.toString().substr(0, 10) &&
          labels.some(label =>
            card.labels.map(cardLabel => cardLabel.name).includes(label)
          )
        );
      }

      return (
        card.dueComplete &&
        parseInt(card.id.substring(0, 8), 16) >
          dateTime.toString().substr(0, 10)
      );
    }).length;
    const incomplete = trello.cards.filter(card => {
      if (!isEmptyOrNil(labels)) {
        return (
          !card.dueComplete &&
          parseInt(card.id.substring(0, 8), 16) >
            dateTime.toString().substr(0, 10) &&
          labels.some(label =>
            card.labels.map(cardLabel => cardLabel.name).includes(label)
          )
        );
      }

      return (
        !card.dueComplete &&
        parseInt(card.id.substring(0, 8), 16) >
          dateTime.toString().substr(0, 10)
      );
    }).length;

    this.setState({
      pieChart: [["Entregue", complete], ["Pendente", incomplete]]
    });
  };

  barChartLoad = trello => {
    const { dateTime, labels } = this.props;

    let barChart;

    if (!isEmptyOrNil(labels)) {
      barChart = labels.map(label => {
        const complete = trello.cards
          .filter(
            card =>
              card.dueComplete &&
              parseInt(card.id.substring(0, 8), 16) >
                dateTime.toString().substr(0, 10) &&
              card.labels.map(label => label.name).includes(label)
          )
          .map(card => card).length;

        const incomplete = trello.cards
          .filter(
            card =>
              !card.dueComplete &&
              parseInt(card.id.substring(0, 8), 16) >
                dateTime.toString().substr(0, 10) &&
              card.labels.map(label => label.name).includes(label)
          )
          .map(card => card).length;

        return [label, complete, complete, incomplete, incomplete];
      });
    } else {
      barChart = trello.labels.map(label => {
        const complete = trello.cards
          .filter(
            card =>
              card.dueComplete &&
              parseInt(card.id.substring(0, 8), 16) >
                dateTime.toString().substr(0, 10) &&
              card.labels.map(label => label.name).includes(label.name)
          )
          .map(card => card).length;

        const incomplete = trello.cards
          .filter(
            card =>
              !card.dueComplete &&
              parseInt(card.id.substring(0, 8), 16) >
                dateTime.toString().substr(0, 10) &&
              card.labels.map(label => label.name).includes(label)
          )
          .map(card => card).length;

        return [label.name, complete, complete, incomplete, incomplete];
      });
    }

    console.log(barChart);

    this.setState({
      barChart
    });
  };

  barChartLoad2 = trello => {
    const { dateTime, labels } = this.props;

    const barChart2 = trello.cards
      .filter(card => {
        if (!isEmptyOrNil(labels)) {
          return (
            parseInt(card.id.substring(0, 8), 16) >
              dateTime.toString().substr(0, 10) &&
            card.dueComplete &&
            labels.some(label =>
              card.labels.map(cardLabel => cardLabel.name).includes(label)
            )
          );
        }

        return (
          parseInt(card.id.substring(0, 8), 16) >
            dateTime.toString().substr(0, 10) && card.dueComplete
        );
      })
      .map(card => {
        const created_at = new Date(
          1000 * parseInt(card.id.substring(0, 8), 16)
        );
        const dued_at = new Date(card.due);

        return [
          card.name,
          Math.ceil(
            (dued_at.getTime() - created_at.getTime()) / (1000 * 3600 * 24)
          )
        ];
      });

    sortByCol(barChart2, 1);

    this.setState({
      barChart2
    });
  };

  render() {
    const { trello, pieChart, barChart, barChart2 } = this.state;

    return (
      <div className="container-fluid">
        <Row>
          <Col>
            <h1>
              <a href={trello.url}>{trello.name}</a>
            </h1>
            <p>
              Equipe: {trello?.members?.map(value => value.fullName).join(", ")}{" "}
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <Chart
              width={"600px"}
              height={"400px"}
              chartType="PieChart"
              loader={<div>Loading Chart</div>}
              data={[["Label", "Atividades"], ...pieChart]}
              options={{
                title: "Atividades do Trello"
              }}
              rootProps={{ "data-testid": "1" }}
            />
          </Col>
          <Col>
            <Chart
              width={"600px"}
              height={"400px"}
              chartType="BarChart"
              loader={<div>Loading Chart</div>}
              data={[
                [
                  "Etiquetas",
                  "Atividades Entregues",
                  { role: "annotation" },
                  "Atividades Pendentes",
                  { role: "annotation" }
                ],
                ...barChart
              ]}
              options={{
                title: "Atividades por Etiqueta",
                chartArea: { width: "50%" },
                hAxis: {
                  title: "Atividades",
                  minValue: 0
                },
                animation: {
                  startup: true,
                  easing: "linear",
                  duration: 1500
                },
                vAxis: {
                  title: "Etiquetas"
                }
              }}
              // For tests
              rootProps={{ "data-testid": "2" }}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Chart
              width={"100%"}
              height={"700px"}
              chartType="BarChart"
              loader={<div>Loading Chart</div>}
              data={[
                ["Atividades entregues", "Quantidade de dias"],
                ...barChart2
              ]}
              options={{
                title: "Tempo de execução das atividades entregues",
                chartArea: { width: "50%" },
                hAxis: {
                  title: "Quantidade de dias das atividades",
                  minValue: 0
                },
                vAxis: {
                  title: "Atividades"
                }
              }}
              // For tests
              rootProps={{ "data-testid": "1" }}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
