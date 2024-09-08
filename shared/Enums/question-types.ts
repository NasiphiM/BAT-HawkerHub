export enum QuestionTypes {
  smallText = 1, //Text up to 50 characters
  bigText = 2, //Text up to 500 characters over multiple lines
  numberNormal = 3, //Number
  dropdown = 4, //Drop down list of one or more items
  checkBox = 5, //One option can be selected
  checkBoxList = 6, //A list of check boxes that allow the user to select multiple answers
  radioButton = 7, //Only one option can be selected
  date = 8, //Date
  time = 9, //Time
  textList = 10, //List of Answers to be entered as Text
  numberList = 11, //List of Answers to be entered as Numbers
  percentList = 12, //List of Answers to be entered as Percentages (Must add up to 100%)
  currency = 13 //Currency
}
