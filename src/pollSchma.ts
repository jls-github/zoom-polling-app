import * as Yup from "yup";
import { string } from "yup/lib/locale";

const answerSchema = Yup.object({
  text: Yup.string().required("Answer text is required."),
});

const questionSchema = Yup.object().shape({
  text: Yup.string().required("Question text is required."),
  answers: Yup.array()
    .required("Answers are required for each question.")
    .min(2, "Each question must have at least two possible answers."),
});

const pollSchema = Yup.object().shape({
  title: Yup.string().required("Your poll must have a name."),
  questions: Yup.array()
    .required("Your poll must have a list of questions.")
    .min(1, "Your poll must have at least one question."),
});

type ValidationStatus = {
  success: boolean;
  errors: YupError[];
};

type YupError = {
  name: string;
  errors: Record<string, any>[];
};

function validatePoll(poll: Record<string, any>): Record<string, any> {
  const validationStatus: ValidationStatus = {
    success: true,
    errors: [],
  };
  pollSchema.validate(poll).catch((err) => handleError(err, validationStatus));
  poll.questions.forEach((question: Record<string, any>) => {
    questionSchema
      .validate(question)
      .catch((err) => handleError(err, validationStatus));
    question.answers.forEach((answer: Record<string, any>) => {
      answerSchema
        .validate(answer)
        .catch((err) => handleError(err, validationStatus));
    });
  });
  return validationStatus;
}

function handleError(
  error: YupError,
  validationStatus: ValidationStatus
): void {
  validationStatus.success = false;
  validationStatus.errors.push(error);
}
