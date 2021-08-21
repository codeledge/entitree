import { DefaultTheme } from "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    code: string;
    contentLineClamp: number;
    contentPaddingLeft: number;
    contentPaddingTop: number;
    datesDisplay: "block" | "none";
    datesFontColor: string;
    datesFontSize: number;
    datesYearOnly: boolean;
    descriptionDisplay: "inline" | "none";
    disabled?: boolean;
    graphBackgroundColor?: string;
    headerHeight: number;
    labelFontColor: string;
    labelFontSize: number;
    labelTextAlign: string;
    name: string;
    nodeBackgroundColor?: string;
    nodeBorder: string;
    nodeBorderRadius: number;
    nodeBoxShadow: string;
    nodeCss: string;
    nodeFlexDirection: "row" | "column";
    nodeFocusedBoxShadow: string;
    nodeHeight: number;
    nodeWidth: number;
    relStroke: string;
    relStrokeWidth: number;
    searchBarHeight: number;
    separationCousins: number;
    separationSameGroup: number;
    separationSiblingSpouse: number;
    separationVertical: number;
    thumbBorderRadius: number;
    thumbCounterDisplay: "block" | "none";
    thumbDisplay: boolean;
    thumbHeight: number;
    thumbWidth: number;
  }
}

export const defaultTheme: DefaultTheme = {
  code: "default",
  contentLineClamp: 4,
  contentPaddingLeft: 3,
  contentPaddingTop: 0,
  datesDisplay: "block",
  datesFontColor: "#666",
  datesFontSize: 11,
  datesYearOnly: false,
  descriptionDisplay: "inline",
  headerHeight: 48,
  labelFontColor: "",
  labelFontSize: 13,
  labelTextAlign: "left",
  name: "Default",
  nodeBackgroundColor: "#eee",
  nodeBorder: "1px solid lightgrey",
  nodeBorderRadius: 5,
  nodeBoxShadow: "4px 4px 10px lightgrey",
  nodeCss: "",
  nodeFlexDirection: "row",
  nodeFocusedBoxShadow: "0px 0px 12px steelblue",
  nodeHeight: 90,
  nodeWidth: 250,
  relStroke: "#eee",
  relStrokeWidth: 14,
  searchBarHeight: 58,
  separationCousins: 40,
  separationSameGroup: 30,
  separationSiblingSpouse: 20,
  separationVertical: 80,
  thumbBorderRadius: 3,
  thumbCounterDisplay: "block",
  thumbDisplay: true,
  thumbHeight: 84,
  thumbWidth: 84,
};

const bigTheme: DefaultTheme = {
  ...defaultTheme,
  code: "big",
  datesFontSize: 9,
  labelFontSize: 16,
  name: "Big",
};

const lightTheme: DefaultTheme = {
  ...defaultTheme,
  code: "light",
  labelFontSize: 16,
  name: "Light",
  nodeBackgroundColor: "rgb(250, 238, 222)",
  nodeWidth: 260,
  thumbHeight: 84,
  thumbWidth: 60,
};

const darkTheme: DefaultTheme = {
  ...defaultTheme,
  code: "dark",
  disabled: true,
  name: "Dark",
};

const onlyLabelTheme: DefaultTheme = {
  ...defaultTheme,
  code: "onlyLabel",
  datesDisplay: "none",
  datesFontSize: 14,
  datesYearOnly: true,
  descriptionDisplay: "none",
  labelFontSize: 16,
  name: "Only Label",
  nodeHeight: 86,
  nodeWidth: 230,
  separationVertical: 60,
  thumbCounterDisplay: "none",
  thumbHeight: 86,
  thumbWidth: 86,
};

const verticalTheme: DefaultTheme = {
  ...defaultTheme,
  code: "vertical",
  datesDisplay: "none",
  datesFontSize: 14,
  datesYearOnly: true,
  descriptionDisplay: "none",
  labelFontSize: 14,
  name: "Vertical",
  nodeFlexDirection: "column",
  nodeHeight: 160,
  nodeWidth: 84,
  separationCousins: 35,
  separationSameGroup: 45,
  separationSiblingSpouse: 25,
  separationVertical: 60,
  thumbCounterDisplay: "none",
  thumbHeight: 84,
  thumbWidth: 84,
};

const mattsTheme: DefaultTheme = {
  ...defaultTheme,
  code: "matt1",
  datesDisplay: "block",
  datesFontColor: "black",
  datesFontSize: 14,
  datesYearOnly: true,
  descriptionDisplay: "none",
  graphBackgroundColor: "#eee7db",
  labelFontColor: "black",
  labelFontSize: 14,
  name: "Matt's theme",
  nodeBackgroundColor: "#f16f61",
  nodeBorder: "none",
  nodeBorderRadius: 10,
  nodeFlexDirection: "column",
  nodeHeight: 190,
  nodeWidth: 100,
  relStroke: "#c2b9ac",
  separationCousins: 35,
  separationSameGroup: 65,
  separationSiblingSpouse: 35,
  separationVertical: 60,
  thumbBorderRadius: 10,
  thumbCounterDisplay: "none",
  thumbHeight: 100,
  thumbWidth: 100,
};

const mattsHorizontalTheme: DefaultTheme = {
  ...defaultTheme,
  code: "matt2",
  datesDisplay: "block",
  datesFontColor: "black",
  datesFontSize: 14,
  datesYearOnly: true,
  descriptionDisplay: "none",
  graphBackgroundColor: "#eee7db",
  labelFontColor: "white",
  labelFontSize: 15,
  labelTextAlign: "center",
  name: "Matt's horizontal theme",
  nodeBorder: "none",
  nodeCss: `.dates {
color:white;
font-style: italic;
}`,
  nodeBackgroundColor: "#c13340",
  nodeBorderRadius: 0,
  nodeFlexDirection: "row",
  nodeHeight: 100,
  nodeWidth: 200,
  relStroke: "#c13340",
  relStrokeWidth: 5,
  separationCousins: 35,
  separationSameGroup: 30,
  separationSiblingSpouse: 30,
  separationVertical: 60,
  thumbBorderRadius: 0,
  thumbCounterDisplay: "none",
  thumbHeight: 100,
  thumbWidth: 100,
};

const onlyText: DefaultTheme = {
  ...defaultTheme,
  code: "only-text",
  name: "Only Text",
  thumbDisplay: false,
};

const rawTheme: DefaultTheme = {
  ...defaultTheme,
  code: "borderless",
  contentPaddingLeft: 0,
  contentPaddingTop: 3,
  datesDisplay: "none",
  datesFontSize: 14,
  datesYearOnly: true,
  descriptionDisplay: "none",
  labelFontSize: 14,
  labelTextAlign: "center",
  name: "Borderless",
  nodeCss: `.colorIcons{
  position: absolute;
  bottom: 0;
  right: 30px;
  }`,
  nodeBackgroundColor: "white",
  nodeBorder: "none",
  nodeBorderRadius: 30,
  nodeBoxShadow: "none",
  nodeFlexDirection: "column",
  nodeFocusedBoxShadow: "none",
  nodeHeight: 130,
  nodeWidth: 84,
  separationCousins: 35,
  separationSameGroup: 45,
  separationSiblingSpouse: 25,
  separationVertical: 60,
  thumbBorderRadius: 30,
  thumbCounterDisplay: "none",
  thumbHeight: 84,
  thumbWidth: 84,
};

export const THEMES = [
  defaultTheme,
  bigTheme,
  lightTheme,
  darkTheme,
  onlyLabelTheme,
  verticalTheme,
  mattsTheme,
  mattsHorizontalTheme,
  rawTheme,
  onlyText,
];
