import * as React from "react";
import {
  TargetsProps,
  TargetsComponentState,
  TargetsComponentProps,
  TargetRowProps,
  TargetsLoaderProps
} from "../interfaces/TargetsInterfaces";
import {
  TargetsComponentWrapper,
  SaveChangesButton,
  TargetsEditForm,
  TargetRowDiv,
  TargetColumnDiv,
  TargetLabel
} from "../styled_components/Targets-component-styles";
import { Targets, getTargetWithName } from "../type_definitions";

const valOrEmpty = (val: number): string => {
  return val > 0 ? String(val) : "";
};

const TargetRow = (props: TargetRowProps) => {
  const { index, target, onTargetChange } = props;
  const name = target.name;
  const isUtrz = name.includes("UTRZ");
  return (
    <TargetRowDiv
      style={{
        backgroundColor:
          target.done >= target.total && target.total > 0
            ? "MediumSeaGreen"
            : "white"
      }}
    >
      <TargetColumnDiv>
        <TargetLabel htmlFor={`${index}.today`}>
          {name.replace("_", " ")}
        </TargetLabel>
      </TargetColumnDiv>
      <TargetColumnDiv>
        <input
          type="text"
          className="form-control"
          id={`${index}.today`}
          value={valOrEmpty(target.today)}
          onChange={onTargetChange}
        />
      </TargetColumnDiv>
      <TargetColumnDiv>
        <input
          type="text"
          className="form-control"
          id={`${index}.done`}
          value={valOrEmpty(target.done)}
          onChange={onTargetChange}
          readOnly={target.today > 0 || isUtrz}
        />
      </TargetColumnDiv>
      <TargetColumnDiv>
        <input
          type="text"
          className="form-control"
          id={`${index}.total`}
          value={valOrEmpty(target.total)}
          onChange={onTargetChange}
          readOnly={isUtrz}
        />
      </TargetColumnDiv>
    </TargetRowDiv>
  );
};

const TargetsLoader = (props: TargetsLoaderProps) => {
  return (
    <form>
      <div className="form-group">
        <textarea
          className="form-control"
          id="TargetsLoader"
          rows={3}
          cols={50}
          onChange={props.targetsLoaderChange}
        />
      </div>
    </form>
  );
};

const TargetsEdit = (props: TargetsProps) => {
  const { targets, onTargetChange } = props;
  const rows = Object.keys(targets).map(function(key) {
    return (
      <TargetRow
        key={key}
        index={key}
        target={targets[key]}
        onTargetChange={onTargetChange}
      />
    );
  });
  return <TargetsEditForm>{rows}</TargetsEditForm>;
};

const TargetsResult = (props: { targets: Targets }) => {
  const { targets } = props;
  const results = Object.keys(targets).map(key => {
    const { name, today, done, total } = targets[key];
    return (
      <div id="resultsToCopy" key={key}>
        {name} {today}/{done}
        {total > 0 ? `/${total}` : ``}
        <br />
      </div>
    );
  });
  return (
    <div>
      <h3>Copy results below</h3>
      {results}
    </div>
  );
};

function jsonCopy<T>(initObj: T): T {
  return JSON.parse(JSON.stringify(initObj));
}

function clearTodayValues(targets: Targets): Targets {
  for (let target in targets) {
    targets[target].today = 0;
  }
  return targets;
}

export default class TargetsComponent extends React.Component<
  TargetsComponentProps,
  Partial<TargetsComponentState>
> {
  readonly state = {
    originalTargets: jsonCopy<Targets>(this.props.targets),
    targets: clearTodayValues(jsonCopy(this.props.targets)),
    place: this.props.place
  };

  clearTodayValues = (targets: Targets) => {
    for (let target in targets) {
      targets[target].today = 0;
    }
    return targets;
  };

  loaderChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.rows = 3;
    const textareaLineHeight = 24;
    const loaderValue = e.target.value;
    const currentRows = ~~(e.target.scrollHeight / textareaLineHeight);
    e.target.rows = currentRows;
    const rowsArray = loaderValue.split(/\n/);
    let targets: Targets = {};
    const reg = / (\d.*)/;
    rowsArray.forEach((val, index) => {
      const nameVal = val.split(reg);
      const rowName = nameVal[0];
      const values = nameVal[1];
      const valuesInArray = values.split("/");
      targets[index] = getTargetWithName(
        rowName,
        Number(valuesInArray[0]),
        Number(valuesInArray[1]),
        valuesInArray.length >= 3 ? Number(valuesInArray[2]) : 0
      );
    });
    this.setState({
      originalTargets: jsonCopy<Targets>(targets),
      targets: clearTodayValues(jsonCopy(targets))
    });

    console.log(`loaderValue ${rowsArray} ${currentRows}`);
  };

  targetChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fieldId = String(e.target.id).split(".");
    const targetName = fieldId[0];
    const targetType = fieldId[1];
    const targetVisibleName = this.state.targets[targetName].name;
    const isUtrz = targetVisibleName.includes("UTRZ");

    let newValue = parseInt(e.target.value, 10);
    newValue = isNaN(newValue) ? 0 : newValue;
    let { originalTargets, targets } = this.state;
    let valChanged = targets[targetName];
    let valOriginal = originalTargets[targetName];
    switch (targetType) {
      case "today":
        valChanged.done = isUtrz ? 0 : Number(valOriginal.done) + newValue;
        valChanged.today = Number(newValue);
        break;
      case "done":
      case "total":
        valOriginal[targetType] = newValue;
        valChanged[targetType] = valOriginal[targetType];
        break;
      default:
        break;
    }
    this.setState({
      targets: targets,
      originalTargets: originalTargets
    });
  };

  saveButtonClicked = (e: React.MouseEvent) => {
    this.props.refreshDatabase(this.state.targets);
  };

  /*
  logOutButtonClicked = (e: React.MouseEvent) => {
    this.props.logoutHandler();
  };
  */

  render() {
    const { targets, place } = this.state;
    return (
      <div className="container">
        <TargetsComponentWrapper>
          <h2>Load targets from previous day</h2>
          <TargetsLoader targetsLoaderChange={this.loaderChanged} />
          <h2>Targets for {place}</h2>
          {targets === null ? (
            <p>No targets loaded</p>
          ) : (
            <div>
              <TargetsEdit
                targets={targets}
                onTargetChange={this.targetChanged}
              />
            </div>
          )}
          <SaveChangesButton
            className="btn btn-primary"
            onClick={this.saveButtonClicked}
          >
            Save changes
          </SaveChangesButton>
          <TargetsResult targets={targets} />
        </TargetsComponentWrapper>
      </div>
    );
  }
}
