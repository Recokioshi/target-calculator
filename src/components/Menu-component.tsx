import * as React from "react";
import { MenuState, MenuProps } from "../interfaces/MenuInterface";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { MenuContainer } from "../styled_components/Menu-component-styles";

export default class Menu extends React.Component<MenuProps, MenuState> {
  readonly state = { extended: false };

  handleLogOutClicked = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    this.props.handleLogOut();
  };

  handleExitPlaceClicked = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    this.props.handleExitPlace();
  };

  toggleMenu = () => {
    this.setState({
      extended: !this.state.extended
    });
  };

  render() {
    const { extended } = this.state;

    const buttonSet = [
      <button
        key={"logOutButton"}
        className="btn btn-secondary text-left"
        onClick={this.handleLogOutClicked}
      >
        Log Out
      </button>,
      <button
        key={"exitPlaceButton"}
        className="btn btn-secondary text-left"
        onClick={this.handleExitPlaceClicked}
      >
        Change place
      </button>
    ];

    return (
      <MenuContainer>
        <button
          className="btn btn-secondary text-left"
          onClick={this.toggleMenu}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        {extended ? buttonSet : null}
      </MenuContainer>
    );
  }
}
