import * as Yup from "yup";

const answerSchema = Yup.object({
  text: Yup.string().required("Answer text is required."),
});

const questionSchema = Yup.object().shape({
    text: Yup.string().required("Question text is required."),
    answers: Yup.array().required("Answers are required for each question.").min(2, "Each question must have at least two possible answers.")
});

const pollSchema = Yup.object().shape({});

function validatePoll(poll: Record<string, any>): boolean {
  return true;
}
