import dayjs from "dayjs";

import Link from "next/link";

import Image from "next/image";

import { redirect }
  from "next/navigation";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.actions";

import {
  getCurrentUser,
} from "@/lib/actions/auth.action";

import {
  Button,
} from "@/components/ui/button";

const FeedbackPage = async ({
  params,
}) => {

  const { id } =
    await params;

  const user =
    await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const interview =
    await getInterviewById(id);

  if (!interview) {
    redirect("/");
  }

  const feedback =
    await getFeedbackByInterviewId({
      interviewId: id,

      userId: user.id,
    });

  if (!feedback) {

    return (

      <section className="section-feedback">

        <div className="flex flex-col gap-6 items-center">

          <h1 className="text-3xl font-semibold">
            Feedback not available yet
          </h1>

          <Button
            className="btn-primary"
            asChild
          >
            <Link href="/">
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </section>
    );
  }

  const categoryEntries =
    Object.entries(
      feedback.categoryScores || {}
    );

  return (

    <section className="section-feedback">

      {/* HEADER */}

      <div className="flex flex-col gap-6">

        <div className="flex flex-row items-center gap-4">

          <Image
            unoptimized
            src={
              interview.coverImage ||
              "/company.png"
            }
            alt="company-logo"
            width={60}
            height={60}
            className="rounded-full size-[60px]"
          />

          <div>

            <h1 className="text-4xl font-semibold">

              {interview.role} Interview
            </h1>

            <p className="text-light-400 mt-2">

              Feedback Report
            </p>
          </div>
        </div>

        <div className="flex flex-row gap-6 flex-wrap">

          {/* SCORE */}

          <div className="flex flex-row gap-2 items-center">

            <Image
              src="/star.svg"
              width={22}
              height={22}
              alt="star"
            />

            <p>

              Overall Score:

              <span className="text-primary-200 font-bold ml-2">

                {feedback.totalScore}/100
              </span>
            </p>
          </div>

          {/* DATE */}

          <div className="flex flex-row gap-2 items-center">

            <Image
              src="/calendar.svg"
              width={22}
              height={22}
              alt="calendar"
            />

            <p>
              {feedback.createdAt
                ? dayjs(
                    feedback.createdAt
                  ).format(
                    "MMM D, YYYY h:mm A"
                  )
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <hr className="my-8 border-dark-200" />

      {/* FINAL ASSESSMENT */}

      <div className="flex flex-col gap-4">

        <h2 className="text-2xl font-semibold">

          Final Assessment
        </h2>

        <p className="text-light-100 leading-7">

          {feedback.finalAssessment}
        </p>
      </div>

      {/* CATEGORY SCORES */}

      <div className="flex flex-col gap-6 mt-10">

        <h2 className="text-2xl font-semibold">

          Interview Breakdown
        </h2>

        {categoryEntries.map(
          ([name, score], index) => (

            <div
              key={index}
              className="bg-dark-200 rounded-xl p-5"
            >

              <div className="flex flex-row justify-between items-center">

                <h3 className="font-semibold capitalize">

                  {name.replace(
                    /([A-Z])/g,
                    " $1"
                  )}
                </h3>

                <p className="text-primary-200 font-bold">

                  {score}/100
                </p>
              </div>
            </div>
          )
        )}
      </div>

      {/* STRENGTHS */}

      <div className="flex flex-col gap-5 mt-10">

        <h2 className="text-2xl font-semibold">

          Strengths
        </h2>

        <ul className="flex flex-col gap-3">

          {feedback.strengths?.map(
            (strength, index) => (

              <li
                key={index}
                className="bg-dark-200 p-4 rounded-xl"
              >
                {strength}
              </li>
            )
          )}
        </ul>
      </div>

      {/* IMPROVEMENTS */}

      <div className="flex flex-col gap-5 mt-10">

        <h2 className="text-2xl font-semibold">

          Areas for Improvement
        </h2>

        <ul className="flex flex-col gap-3">

          {feedback.areasForImprovement?.map(
            (area, index) => (

              <li
                key={index}
                className="bg-dark-200 p-4 rounded-xl"
              >
                {area}
              </li>
            )
          )}
        </ul>
      </div>

      {/* BUTTONS */}

      <div className="flex flex-row gap-4 mt-10 max-sm:flex-col">

        <Button
          className="btn-secondary flex-1"
          asChild
        >
          <Link href="/">
            Back to Dashboard
          </Link>
        </Button>

        <Button
          className="btn-primary flex-1"
          asChild
        >
          <Link
            href={`/interview/${id}`}
          >
            Retake Interview
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default FeedbackPage;