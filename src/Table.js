import React, { Component } from "react";
import { Badge, Table } from "reactstrap";
import { isEmptyOrNil } from "./isEmptyOrNil";

export default class Tabela extends Component {
  state = {
    trello: []
  };

  componentDidMount = () => {
    const { json } = this.props;

    const trello = JSON.parse(json);

    if (trello.cards !== undefined) {
      this.setState({ trello });
    }
  };

  render() {
    const { trello } = this.state;

    const { dateTime, labels } = this.props;

    var options = { year: "numeric", month: "numeric", day: "numeric" };

    if (isEmptyOrNil(trello)) {
      return (
        <p className="text-center">
          JSON do trello é inválido ou está incorreto
        </p>
      );
    }

    return (
      <div className="container-fluid mt-1">
        <h1>
          <a href={trello.url}>{trello.name}</a>
        </h1>

        <p>Equipe: {trello.members.map(value => value.fullName).join(", ")} </p>
        <Table className="table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>URL</th>
              <th>Status</th>
              <th>Etiquetas</th>
              <th>Anexos</th>
            </tr>
          </thead>
          <tbody>
            {trello.cards
              .filter(card => {
                if (!isEmptyOrNil(labels)) {
                  return (
                    parseInt(card.id.substring(0, 8), 16) >
                      dateTime.toString().substr(0, 10) &&
                    labels.some(label =>
                      card.labels
                        .map(cardLabel => cardLabel.name)
                        .includes(label)
                    )
                  );
                }

                return (
                  parseInt(card.id.substring(0, 8), 16) >
                  dateTime.toString().substr(0, 10)
                );
              })
              .map(data => {
                const date = new Date(
                  1000 * parseInt(data.id.substring(0, 8), 16)
                );

                return (
                  <tr key={data.id}>
                    <td>{date.toLocaleDateString("pt-BR", options)}</td>
                    <td>{data.name}</td>
                    <td>
                      <a href={data.shortUrl} target="_blank">
                        {data.shortUrl}
                      </a>
                    </td>
                    <td>
                      {data.dueComplete ? (
                        <Badge color="success">ENTREGUE</Badge>
                      ) : (
                        <Badge color="warning">PENDENTE</Badge>
                      )}
                    </td>
                    <td>
                      {data.labels.map(label => (
                        <Badge
                          key={label.id}
                          className="mr-1"
                          style={{ backgroundColor: label.color }}
                        >
                          {label.name}
                        </Badge>
                      ))}
                    </td>

                    <td>
                      {data.attachments.map(attachment => (
                        <Badge
                          key={attachment.id}
                          style={{ cursor: "pointer" }}
                          className="mr-1"
                          color="info"
                          onClick={() => window.open(attachment.url, "_blank")}
                        >
                          {attachment.name}
                        </Badge>
                      ))}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>
    );
  }
}
