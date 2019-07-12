import styled from "styled-components";

const TARGETS_ROW_GAP = 0.5;
const TARGETS_COLUMN_GAP = TARGETS_ROW_GAP;

export const TargetsEditForm = styled.form`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export const TargetRowDiv = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  align-items: center;
  margin-top: ${TARGETS_ROW_GAP / 2}em;
  margin-bottom: ${TARGETS_ROW_GAP / 2}em;
  padding-top: ${TARGETS_ROW_GAP / 2}em;
  padding-bottom: ${TARGETS_ROW_GAP / 2}em;
  border-radius: 8px;
`;

export const TargetColumnDiv = styled.div`
  display: block;
  margin-left: ${TARGETS_COLUMN_GAP / 2}em;
  margin-right: ${TARGETS_COLUMN_GAP / 2}em;
`;

export const TargetLabel = styled.label`
  position: relative;
  top: 40%;
  transform: translateY(-50%);
`;

export const SaveChangesButton = styled.button`
  margin-top: 1em;
  margin-bottom: 1em;
`;

export const TargetsComponentWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: 5em;
`;
