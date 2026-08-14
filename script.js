/* =========================================
   MEETMIND — AI MEETING INTELLIGENCE
   Vanilla JavaScript
========================================= */

"use strict";


/* =========================================
   STORAGE
========================================= */

const STORAGE_KEYS = {
    meetings: "meetmind_meetings",
    tasks: "meetmind_tasks"
};


let meetings = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.meetings)
) || [];


let tasks = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.tasks)
) || [];


/* =========================================
   DOM
========================================= */

const views = document.querySelectorAll(".view");

const navItems = document.querySelectorAll(
    ".nav-item[data-view]"
);

const transcriptInput =
    document.getElementById("transcriptInput");

const wordCount =
    document.getElementById("wordCount");

const analyzeBtn =
    document.getElementById("analyzeMeetingBtn");

const analyzeFromDashboard =
    document.getElementById("analyzeFromDashboard");

const newMeetingBtn =
    document.getElementById("newMeetingBtn");

const analysisModal =
    document.getElementById("analysisModal");

const closeModal =
    document.getElementById("closeAnalysisBtn");

const newAnalysis =
    document.getElementById("newAnalysis");

const mobileMenu =
    document.getElementById("mobileMenu");

const sidebar =
    document.querySelector(".sidebar");


/* =========================================
   VIEW NAVIGATION
========================================= */

function showView(viewId) {

    views.forEach(view => {
        view.classList.remove("active");
    });


    const target =
        document.getElementById(viewId);


    if (!target) return;


    target.classList.add("active");


    navItems.forEach(item => {

        item.classList.toggle(
            "active",
            item.dataset.view === viewId
        );

    });


    updateBreadcrumb(viewId);


    closeMobileSidebar();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


navItems.forEach(item => {

    item.addEventListener("click", event => {

        event.preventDefault();

        showView(item.dataset.view);

    });

});


function updateBreadcrumb(viewId) {

    const breadcrumb =
        document.querySelector(
            ".breadcrumb strong"
        );


    if (!breadcrumb) return;


    const names = {
        dashboard: "Dashboard",
        meetings: "Meetings",
        tasks: "Action Items",
        insights: "Insights"
    };


    breadcrumb.textContent =
        names[viewId] || "Dashboard";
}


/* =========================================
   MOBILE SIDEBAR
========================================= */

if (mobileMenu) {

    mobileMenu.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle("open");

        }
    );

}


function closeMobileSidebar() {

    if (sidebar) {
        sidebar.classList.remove("open");
    }

}


/* =========================================
   NEW MEETING
========================================= */

function openMeetingWorkspace() {

    showView("meetings");

    if (transcriptInput) {

        setTimeout(() => {
            transcriptInput.focus();
        }, 250);

    }

}


if (newMeetingBtn) {

    newMeetingBtn.addEventListener(
        "click",
        openMeetingWorkspace
    );

}


if (analyzeFromDashboard) {

    analyzeFromDashboard.addEventListener(
        "click",
        openMeetingWorkspace
    );

}


/* =========================================
   WORD COUNTER
========================================= */

function updateWordCount() {

    if (!transcriptInput || !wordCount) return;


    const text =
        transcriptInput.value.trim();


    if (!text) {

        wordCount.textContent = "0";

        return;
    }


    const words =
        text.split(/\s+/).filter(Boolean);


    wordCount.textContent =
        words.length;
}


if (transcriptInput) {

    transcriptInput.addEventListener(
        "input",
        updateWordCount
    );

}


/* =========================================
   DEMO TRANSCRIPT
========================================= */

const demoTranscript = `
Chris said the Shopify migration is almost complete.
Dev Master needs to finish the redirects by Friday.
Sarah will review the product pages tomorrow.
The team agreed to launch next Monday.
Rupert will send the final approval after testing.
We still need to confirm the analytics setup.
Everyone agreed that the homepage is ready.
`;


/* =========================================
   ANALYZE MEETING
========================================= */

if (analyzeBtn) {

    analyzeBtn.addEventListener(
        "click",
        analyzeMeeting
    );

}


function analyzeMeeting() {

    let transcript =
        transcriptInput
            ? transcriptInput.value.trim()
            : "";


    /*
       If the user has not entered anything,
       use demo data so the application
       can still be tested.
    */

    if (!transcript) {

        transcript = demoTranscript;

        if (transcriptInput) {

            transcriptInput.value =
                transcript.trim();

            updateWordCount();

        }

    }

const result =
    generateMeetingIntelligence(
        transcript
    );

const timelineEvents =
    generateTimelineEvents(
        transcript
    );

renderAnalysis(result);

renderTimeline(
    timelineEvents
);

analysisModal.classList.add("show");

}


/* =========================================
   AI-LIKE ANALYSIS ENGINE
========================================= */

function generateMeetingIntelligence(text) {

    const normalized =
        text.replace(/\s+/g, " ").trim();


    const sentences =
        normalized
            .split(/[.!?]+/)
            .map(sentence => sentence.trim())
            .filter(Boolean);


    const people =
        extractPeople(normalized);


    const actionItems =
        extractActionItems(
            sentences,
            people
        );


    const decisions =
        extractDecisions(sentences);


    const deadlines =
        extractDeadlines(normalized);


    const questions =
        extractQuestions(normalized);


    const health =
        calculateMeetingHealth(
            actionItems,
            decisions,
            deadlines,
            questions
        );


    const summary =
        generateSummary(
            sentences,
            decisions
        );


    return {

        summary,
        actionItems,
        decisions,
        deadlines,
        questions,
        people,
        health,
        createdAt: new Date().toISOString(),
        transcript: text

    };

}





/* =========================================
   MEETING TIMELINE INTELLIGENCE
========================================= */

function generateTimelineEvents(transcript) {

    const sentences = transcript
        .replace(/\s+/g, " ")
        .split(/[.!?]+/)
        .map(sentence => sentence.trim())
        .filter(Boolean);

    const events = [];

    sentences.forEach((sentence, index) => {

        const lower = sentence.toLowerCase();

        let type = "Important Discussion";

        if (
            lower.includes("decided") ||
            lower.includes("agreed") ||
            lower.includes("approved") ||
            lower.includes("confirmed")
        ) {
            type = "Decision";
        }

        else if (
            lower.includes("will") ||
            lower.includes("needs to") ||
            lower.includes("need to") ||
            lower.includes("must") ||
            lower.includes("should")
        ) {
            type = "Action Item";
        }

        else if (
            lower.includes("deadline") ||
            lower.includes("by friday") ||
            lower.includes("by monday") ||
            lower.includes("tomorrow") ||
            lower.includes("next week")
        ) {
            type = "Deadline";
        }

        else if (
            lower.includes("discuss") ||
            lower.includes("topic") ||
            lower.includes("regarding") ||
            lower.includes("about")
        ) {
            type = "Key Topic";
        }

        events.push({
            id: index,
            type: type,
            text: sentence,
            sourceIndex: index
        });

    });

    return events;
}

/* =========================================
   RENDER MEETING TIMELINE
========================================= */

function renderTimeline(events) {

    const timeline =
        document.getElementById("meetingTimeline");

    const eventCount =
        document.getElementById("timelineEventCount");

    if (!timeline || !eventCount) return;


    eventCount.textContent =
        `${events.length} event${events.length === 1 ? "" : "s"}`;


    if (!events.length) {

        timeline.innerHTML = `
            <div class="timeline-empty">
                No important timeline events detected.
            </div>
        `;

        return;
    }


    timeline.innerHTML =
        events
            .map(event => `

                <div
                    class="timeline-event"
                    data-source-index="${event.sourceIndex}"
                >

                    <span class="timeline-dot"></span>

                    <span class="timeline-type">
                        ${escapeHTML(event.type)}
                    </span>

                    <div class="timeline-content">

                        ${escapeHTML(event.text)}

                        <span class="timeline-source">
                            Transcript segment ${event.sourceIndex + 1}
                        </span>

                    </div>

                </div>

            `)
            .join("");


            timeline
    .querySelectorAll(".timeline-event")
    .forEach((element, index) => {

        element.addEventListener("click", () => {

            const event = events[index];

            if (!transcriptInput || !event) return;

            const transcript = transcriptInput.value;

            const start =
                transcript
                    .toLowerCase()
                    .indexOf(
                        event.text.toLowerCase()
                    );

            if (start === -1) return;

            const end =
                start + event.text.length;

            transcriptInput.focus();

            transcriptInput.setSelectionRange(
                start,
                end
            );

            document
                .querySelectorAll(".timeline-event")
                .forEach(item =>
                    item.classList.remove("is-active")
                );

            element.classList.add("is-active");

            transcriptInput.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        });

    });


}




/* =========================================
   SUMMARY
========================================= */

function generateSummary(
    sentences,
    decisions
) {

    if (!sentences.length) {

        return "No meeting content was detected.";

    }


    const important =
        sentences.slice(0, 3);


    let summary =
        important.join(". ") + ".";


    if (decisions.length) {

        summary +=
            ` ${decisions.length} key decision${
                decisions.length > 1 ? "s were" : " was"
            } identified during the meeting.`;

    }


    return summary;
}


/* =========================================
   PEOPLE EXTRACTION
========================================= */

function extractPeople(text) {

    const knownNames = [
        "Chris",
        "Dev Master",
        "Sarah",
        "Rupert",
        "Alex",
        "John",
        "Mike",
        "David",
        "James"
    ];


    return knownNames.filter(name => {

        return new RegExp(
            `\\b${name}\\b`,
            "i"
        ).test(text);

    });

}


/* =========================================
   ACTION ITEMS
========================================= */

function extractActionItems(
    sentences,
    people
) {

    const actionWords = [

        "needs to",
        "need to",
        "will",
        "must",
        "should",
        "finish",
        "review",
        "send",
        "confirm",
        "complete",
        "prepare",
        "update",
        "test",
        "check"

    ];


    let results = [];


    sentences.forEach(sentence => {

        const lower =
            sentence.toLowerCase();


        const isAction =
            actionWords.some(
                word =>
                    lower.includes(word)
            );


        if (isAction) {

            let owner =
                people.find(person =>
                    new RegExp(
                        `\\b${person}\\b`,
                        "i"
                    ).test(sentence)
                );


            let clean =
                sentence;


            results.push({

                text: clean,
                owner: owner || "Unassigned"

            });

        }

    });


    /*
       Remove duplicates
    */

    results =
        results.filter(
            (item, index, array) =>
                index ===
                array.findIndex(
                    x =>
                        x.text.toLowerCase() ===
                        item.text.toLowerCase()
                )
        );


    return results.slice(0, 8);
}


/* =========================================
   DECISIONS
========================================= */

function extractDecisions(sentences) {

    const decisionWords = [

        "agreed",
        "decided",
        "approved",
        "confirmed",
        "will launch",
        "going forward",
        "final decision",
        "ready"

    ];


    return sentences
        .filter(sentence => {

            const lower =
                sentence.toLowerCase();


            return decisionWords.some(
                word =>
                    lower.includes(word)
            );

        })
        .slice(0, 6);

}


/* =========================================
   DEADLINES
========================================= */

function extractDeadlines(text) {

    const deadlinePatterns = [

        "today",
        "tomorrow",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
        "next week",
        "next month",
        "this week"

    ];


    const found = [];


    deadlinePatterns.forEach(
        deadline => {

            if (
                new RegExp(
                    `\\b${deadline}\\b`,
                    "i"
                ).test(text)
            ) {

                found.push(
                    deadline.charAt(0).toUpperCase() +
                    deadline.slice(1)
                );

            }

        }
    );


    return [...new Set(found)];

}


/* =========================================
   QUESTIONS
========================================= */

function extractQuestions(text) {

    const sentences =
        text.split(/[.!?]+/);


    return sentences
        .map(sentence => sentence.trim())
        .filter(sentence => {

            return (
                sentence.includes("?") ||
                /need to confirm|still need|pending/i
                    .test(sentence)
            );

        })
        .slice(0, 5);

}


/* =========================================
   MEETING HEALTH
========================================= */

function calculateMeetingHealth(
    actions,
    decisions,
    deadlines,
    questions
) {

    let score = 60;


    score +=
        Math.min(actions.length * 4, 16);


    score +=
        Math.min(decisions.length * 5, 15);


    score +=
        Math.min(deadlines.length * 3, 9);


    score -=
        Math.min(questions.length * 4, 15);


    score =
        Math.max(
            0,
            Math.min(100, score)
        );


    return score;

}


/* =========================================
   RENDER ANALYSIS
========================================= */
function renderAnalysis(result) {

    const summary =
        document.getElementById("analysisSummary");

    const health =
        document.getElementById("analysisHealth");

    const people =
        document.getElementById("analysisPeople");

    const actions =
        document.getElementById("analysisActions");

    const decisions =
        document.getElementById("analysisDecisions");

    const deadlines =
        document.getElementById("analysisDeadlines");

    const questions =
        document.getElementById("analysisQuestions");


    if (summary) {
        summary.textContent = result.summary;
    }


    if (health) {
        health.textContent = `${result.health}%`;
    }


    if (people) {

        people.innerHTML =
            result.people.length
                ? result.people
                    .map(person => `
                        <div>
                            <span class="result-check">✓</span>
                            ${escapeHTML(person)}
                        </div>
                    `)
                    .join("")
                : `
                    <div>
                        No participants detected
                    </div>
                `;
    }


    if (actions) {
        actions.innerHTML =
            renderActionItems(result.actionItems);
    }


    if (decisions) {
        decisions.innerHTML =
            renderDecisions(result.decisions);
    }


    if (deadlines) {

        deadlines.innerHTML =
            result.deadlines.length
                ? result.deadlines
                    .map(deadline => `
                        <div>
                            <span class="result-check">✓</span>
                            ${escapeHTML(deadline)}
                        </div>
                    `)
                    .join("")
                : `
                    <div>
                        No deadlines detected
                    </div>
                `;
    }


    if (questions) {

        questions.innerHTML =
            result.questions.length
                ? result.questions
                    .map(question => `
                        <div>
                            <span class="result-check">✓</span>
                            ${escapeHTML(question)}
                        </div>
                    `)
                    .join("")
                : `
                    <div>
                        No follow-up questions detected
                    </div>
                `;
    }


    updateHealthColor(result.health);
}


/* =========================================
   RENDER ACTION ITEMS
========================================= */

function renderActionItems(items) {

    if (!items.length) {

        return `
            <div>
                <span class="result-check">✓</span>
                No specific action items detected
            </div>
        `;

    }


    return items
        .map(item => `

            <div>
                <span class="result-check">✓</span>

                <span>
                    ${escapeHTML(item.text)}
                </span>
            </div>

        `)
        .join("");

}


/* =========================================
   RENDER DECISIONS
========================================= */

function renderDecisions(decisions) {

    if (!decisions.length) {

        return `
            <div>
                <span class="result-check">✓</span>
                No explicit decisions detected
            </div>
        `;

    }


    return decisions
        .map(decision => `

            <div>
                <span class="result-check">✓</span>

                <span>
                    ${escapeHTML(decision)}
                </span>
            </div>

        `)
        .join("");

}


/* =========================================
   HEALTH COLOR
========================================= */

function updateHealthColor(score) {

    const health =
        document.getElementById(
            "healthScore"
        );


    if (!health) return;


    if (score >= 80) {

        health.style.color =
            "#22c55e";

    } else if (score >= 60) {

        health.style.color =
            "#f59e0b";

    } else {

        health.style.color =
            "#ef4444";

    }

}


/* =========================================
   SAVE MEETING
========================================= */

function saveMeeting(result) {

    const meeting = {

        id:
            Date.now(),

        title:
            generateMeetingTitle(
                result.transcript
            ),

        date:
            new Date().toISOString(),

        summary:
            result.summary,

        actions:
            result.actionItems,

        decisions:
            result.decisions,

        deadlines:
            result.deadlines,

        health:
            result.health

    };


    meetings.unshift(meeting);


    meetings =
        meetings.slice(0, 20);


    localStorage.setItem(
        STORAGE_KEYS.meetings,
        JSON.stringify(meetings)
    );


    /*
       Add extracted action items
       to global task storage.
    */

    result.actionItems.forEach(item => {

        tasks.push({

            id: Date.now() +
                Math.random(),

            title: item.text,

            owner: item.owner,

            status: "pending",

            meetingId: meeting.id

        });

    });


    localStorage.setItem(
        STORAGE_KEYS.tasks,
        JSON.stringify(tasks)
    );


    updateRecentMeetings();


    return meeting;

}


/* =========================================
   MEETING TITLE
========================================= */

function generateMeetingTitle(text) {

    const firstSentence =
        text
            .split(/[.!?]/)[0]
            .trim();


    if (!firstSentence) {

        return "Untitled Meeting";

    }


    const words =
        firstSentence
            .split(/\s+/)
            .slice(0, 5);


    return words.join(" ");

}


/* =========================================
   SAVE BUTTON
========================================= */

document
    .querySelectorAll(
        ".modal-actions .primary-btn"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const transcript =
                    transcriptInput
                        ? transcriptInput.value.trim()
                        : demoTranscript;


                const result =
                    generateMeetingIntelligence(
                        transcript
                    );


                saveMeeting(result);


                closeAnalysisModal();


                showToast(
                    "Meeting saved successfully"
                );

            }
        );

    });


/* =========================================
   MODAL
========================================= */

function closeAnalysisModal() {

    if (analysisModal) {

        analysisModal.classList.remove(
            "show"
        );

    }

}


if (closeModal) {

    closeModal.addEventListener(
        "click",
        closeAnalysisModal
    );

}


if (newAnalysis) {

    newAnalysis.addEventListener(
        "click",
        () => {

            closeAnalysisModal();


            if (transcriptInput) {

                transcriptInput.value = "";

                updateWordCount();

                transcriptInput.focus();

            }

        }
    );

}


if (analysisModal) {

    analysisModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                analysisModal
            ) {

                closeAnalysisModal();

            }

        }
    );

}


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeAnalysisModal();

        }

    }
);


/* =========================================
   RECENT MEETINGS
========================================= */

function updateRecentMeetings() {

    const rows =
        document.querySelectorAll(
            ".meeting-table .table-row:not(.table-head)"
        );


    meetings
        .slice(0, rows.length)
        .forEach((meeting, index) => {

            const row =
                rows[index];


            if (!row) return;


            const title =
                row.querySelector(
                    ".table-meeting strong"
                );


            const summary =
                row.querySelectorAll(
                    "span"
                )[1];


            if (title) {

                title.textContent =
                    meeting.title;

            }


            if (summary) {

                summary.textContent =
                    `${meeting.decisions.length} decisions · ${meeting.actions.length} tasks`;

            }

        });

}


/* =========================================
   TOAST
========================================= */

function showToast(message) {

    const existing =
        document.querySelector(
            ".meetmind-toast"
        );


    if (existing) {

        existing.remove();

    }


    const toast =
        document.createElement("div");


    toast.className =
        "meetmind-toast";


    toast.innerHTML = `
        <span>✓</span>
        ${escapeHTML(message)}
    `;


    Object.assign(
        toast.style,
        {

            position: "fixed",
            bottom: "25px",
            right: "25px",
            zIndex: "9999",

            display: "flex",
            alignItems: "center",
            gap: "9px",

            padding: "12px 16px",

            border: "1px solid rgba(255,255,255,.1)",
            borderRadius: "11px",

            color: "#fff",

            background: "#171923",

            boxShadow:
                "0 15px 40px rgba(0,0,0,.4)",

            fontSize: "11px"

        }
    );


    document.body.appendChild(toast);


    setTimeout(() => {

        toast.style.opacity = "0";

        toast.style.transform =
            "translateY(8px)";

        toast.style.transition =
            ".25s ease";

    }, 2200);


    setTimeout(() => {

        toast.remove();

    }, 2500);

}


/* =========================================
   TASK CHECKBOXES
========================================= */

document
    .querySelectorAll(
        ".task .checkbox"
    )
    .forEach(checkbox => {

        checkbox.addEventListener(
            "click",
            () => {

                checkbox.style.background =
                    "#22c55e";

                checkbox.style.borderColor =
                    "#22c55e";

                checkbox.innerHTML =
                    "✓";

                checkbox.style.color =
                    "#fff";

                const task =
                    checkbox.closest(
                        ".task"
                    );


                if (task) {

                    const title =
                        task.querySelector(
                            "strong"
                        );


                    if (title) {

                        title.style.textDecoration =
                            "line-through";

                        title.style.opacity =
                            ".45";

                    }

                }

            }
        );

    });


/* =========================================
   UPLOAD BUTTON
========================================= */

const uploadBtn =
    document.querySelector(
        ".upload-btn"
    );


if (uploadBtn) {

    uploadBtn.addEventListener(
        "click",
        () => {

            const input =
                document.createElement(
                    "input"
                );


            input.type = "file";

            input.accept =
                ".txt,.md,.csv,.json";


            input.addEventListener(
                "change",
                event => {

                    const file =
                        event.target.files[0];


                    if (!file) return;


                    const reader =
                        new FileReader();


                    reader.onload =
                        e => {

                            if (
                                transcriptInput
                            ) {

                                transcriptInput.value =
                                    e.target.result;

                                updateWordCount();

                                showToast(
                                    "Transcript imported"
                                );

                            }

                        };


                    reader.readAsText(file);

                }
            );


            input.click();

        }
    );

}


/* =========================================
   SEARCH BUTTON
========================================= */

const searchBtn =
    document.querySelector(
        ".icon-btn[title='Search']"
    );


if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        () => {

            openMeetingWorkspace();

            if (transcriptInput) {

                transcriptInput.focus();

            }

        }
    );

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================
   INITIALIZATION
========================================= */

function initializeApp() {

    updateWordCount();

    updateRecentMeetings();

    showView("dashboard");

}


initializeApp();


console.log(
    "✦ MeetMind AI Meeting Intelligence loaded"
);