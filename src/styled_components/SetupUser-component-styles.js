import styled from "styled-components";

const BUTTONS_ROW_GAP = 0.5;

export const PlacesSetContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-content: space-around;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 1em;
  margin-bottom: 1em;
`;

export const PlaceButton = styled.button`
  margin: ${BUTTONS_ROW_GAP / 2}em;
`;
