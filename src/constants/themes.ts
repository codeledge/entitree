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
    nodeVerticalSpacing: number;
    nodeWidth: number;
    relStroke: string;
    relStrokeWidth: number;
    searchBarHeight: number;
    separationCousins: number;
    separationSameGroup: number;
    separationSiblingSpouse: number;
    thumbBorderRadius: number;
    thumbCounterDisplay: "block" | "none";
    thumbHeight: number;
    thumbWidth: number;
    thumbDisplay: boolean;
  }
}

export const defaultTheme: DefaultTheme = {
  code: "default",
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
  contentLineClamp: 4,
  name: "Default",
  nodeBackgroundColor: "#eee",
  nodeBorder: "1px solid lightgrey",
  nodeBorderRadius: 5,
  nodeBoxShadow: "4px 4px 10px lightgrey",
  nodeCss: "",
  nodeFlexDirection: "row",
  nodeFocusedBoxShadow: "0px 0px 12px steelblue",
  nodeHeight: 90,
  nodeVerticalSpacing: 80,
  nodeWidth: 250,
  relStroke: "#eee",
  relStrokeWidth: 14,
  searchBarHeight: 58,
  separationCousins: 40,
  separationSameGroup: 30,
  separationSiblingSpouse: 20,
  thumbBorderRadius: 3,
  thumbCounterDisplay: "block",
  thumbHeight: 84,
  thumbWidth: 84,
  thumbDisplay: true,
};

const bigTheme: DefaultTheme = {
  ...defaultTheme,
  code: "big",
  name: "Big",
  datesFontSize: 9,
  labelFontSize: 16,
};

const lightTheme: DefaultTheme = {
  ...defaultTheme,
  code: "light",
  name: "Light",
  labelFontSize: 16,
  nodeBackgroundColor: "rgb(250, 238, 222)",
  nodeWidth: 260,
  thumbHeight: 84,
  thumbWidth: 60,
};

const darkTheme: DefaultTheme = {
  ...defaultTheme,
  code: "dark",
  name: "Dark",
  disabled: true,
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
  nodeVerticalSpacing: 60,
  nodeWidth: 230,
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
  nodeVerticalSpacing: 60,
  nodeWidth: 84,
  separationCousins: 35,
  separationSameGroup: 45,
  separationSiblingSpouse: 25,
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
  labelFontSize: 14,
  labelFontColor: "black",
  name: "Matt's theme",
  nodeBorder: "none",
  nodeFlexDirection: "column",
  nodeHeight: 190,
  nodeVerticalSpacing: 60,
  nodeWidth: 100,
  nodeBorderRadius: 10,
  nodeBackgroundColor: "#f16f61",
  relStroke: "#c2b9ac",
  separationCousins: 35,
  separationSameGroup: 65,
  separationSiblingSpouse: 35,
  thumbCounterDisplay: "none",
  thumbHeight: 100,
  thumbWidth: 100,
  thumbBorderRadius: 10,
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
  labelFontSize: 15,
  labelFontColor: "white",
  labelTextAlign: "center",
  name: "Matt's horizontal theme",
  nodeBorder: "none",
  nodeCss: `.dates {
color:white;
font-style: italic;
}`,
  nodeFlexDirection: "row",
  nodeHeight: 100,
  nodeVerticalSpacing: 60,
  nodeWidth: 200,
  nodeBorderRadius: 0,
  nodeBackgroundColor: "#c13340",
  relStroke: "#c13340",
  relStrokeWidth: 5,
  separationCousins: 35,
  separationSameGroup: 30,
  separationSiblingSpouse: 30,
  thumbCounterDisplay: "none",
  thumbHeight: 100,
  thumbWidth: 100,
  thumbBorderRadius: 0,
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
  name: "Borderless",
  contentPaddingLeft: 0,
  contentPaddingTop: 3,
  nodeCss: `.colorIcons{
  position: absolute;
  bottom: 0;
  right: 30px;
  }`,
  datesDisplay: "none",
  datesFontSize: 14,
  datesYearOnly: true,
  descriptionDisplay: "none",
  labelFontSize: 14,
  labelTextAlign: "center",
  nodeBackgroundColor: "white",
  nodeBorder: "none",
  nodeBorderRadius: 30,
  nodeBoxShadow: "none",
  nodeFlexDirection: "column",
  nodeFocusedBoxShadow: "none",
  nodeHeight: 130,
  nodeVerticalSpacing: 60,
  nodeWidth: 84,
  separationCousins: 35,
  separationSameGroup: 45,
  separationSiblingSpouse: 25,
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
