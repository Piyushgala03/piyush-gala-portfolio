"use strict";

/*
=========================================================
PORTFOLIO APPLICATION
=========================================================

Responsibilities:

1. Load data.json
2. Control section visibility
3. Render navigation
4. Render profile
5. Render about section
6. Render education
7. Render experience
8. Render skills
9. Render projects
10. Render achievements
11. Render freelance projects
12. Render resume/contact information
13. Initialize interactions
=========================================================
*/


/* =========================================================
   APPLICATION STATE
========================================================= */

let portfolioData = null;


/* =========================================================
   DOM HELPERS
========================================================= */

const getElement = (selector) => {
    return document.querySelector(selector);
};


const getElements = (selector) => {
    return document.querySelectorAll(selector);
};


/**
 * Safely set text content.
 */
const setText = (selector, value) => {

    const element = getElement(selector);

    if (element) {
        element.textContent = value ?? "";
    }
};


/**
 * Create an HTML element.
 */
const createElement = (
    tag,
    className = "",
    text = ""
) => {

    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text) {
        element.textContent = text;
    }

    return element;
};


/**
 * Create external link.
 */
const createLink = (
    href,
    text,
    className = ""
) => {

    const link = createElement(
        "a",
        className,
        text
    );

    link.href = href;

    link.target = "_blank";
    link.rel = "noopener noreferrer";

    return link;
};


/* =========================================================
   LOAD JSON
========================================================= */

async function loadPortfolioData() {

    try {

        const response = await fetch("data.json");

        if (!response.ok) {
            throw new Error(
                `Unable to load data.json (${response.status})`
            );
        }

        portfolioData = await response.json();

        initializePortfolio();

    } catch (error) {

        console.error(
            "Portfolio loading error:",
            error
        );

        showToast(
            "Unable to load portfolio data."
        );
    }
}


/* =========================================================
   INITIALIZE
========================================================= */

function initializePortfolio() {

    if (!portfolioData) {
        return;
    }

    updatePageMetadata();

    applySectionVisibility();

    renderNavigation();

    renderHero();

    renderAbout();

    renderEducation();

    renderExperience();

    renderSkills();

    renderProjects();

    renderAchievements();

    renderFreelance();

    renderResume();

    renderContact();

    renderFooter();

    initializeNavigation();

    initializeScrollEffects();

    initializeRevealAnimations();
}


/* =========================================================
   PAGE METADATA
========================================================= */

function updatePageMetadata() {

    const personal =
        portfolioData.personal || {};

    const seo =
        portfolioData.seo || {};

    document.title =
        seo.title ||
        `${personal.name || "Developer"} | Portfolio`;

    const descriptionElement =
        document.querySelector(
            'meta[name="description"]'
        );

    if (
        descriptionElement &&
        seo.description
    ) {
        descriptionElement.content =
            seo.description;
    }
}


/* =========================================================
   SECTION VISIBILITY
========================================================= */

function applySectionVisibility() {

    const sections =
        portfolioData.sections || {};

    getElements("[data-section]")
        .forEach((section) => {

            const sectionName =
                section.dataset.section;

            const sectionConfig =
                sections[sectionName];

            if (
                sectionConfig &&
                sectionConfig.enabled === false
            ) {
                section.remove();
            }
        });
}


/* =========================================================
   NAVIGATION
========================================================= */

function renderNavigation() {

    const navigation =
        getElement("#navigation-list");

    if (!navigation) {
        return;
    }

    navigation.innerHTML = "";

    const sections =
        portfolioData.sections || {};

    const navigationLabels =
        portfolioData.navigation?.labels || {};

    Object.entries(sections)
        .forEach(
            ([sectionName, config]) => {

                if (
                    sectionName === "hero" ||
                    config.enabled === false
                ) {
                    return;
                }

                const listItem =
                    createElement(
                        "li",
                        "site-navigation__item"
                    );

                const link =
                    createElement(
                        "a",
                        "site-navigation__link",
                        navigationLabels[
                            sectionName
                        ] ||
                        capitalize(sectionName)
                    );

                link.href =
                    `#${sectionName}`;

                listItem.appendChild(link);

                navigation.appendChild(listItem);
            }
        );
}


/* =========================================================
   HERO
========================================================= */

function renderHero() {

    const personal =
        portfolioData.personal;

    const hero =
        portfolioData.hero;

    const contact =
        portfolioData.contact;

    setText(
        "#site-logo",
        personal.shortName ||
        personal.name
    );

    setText(
        "#hero-eyebrow",
        hero.eyebrow
    );

    setText(
        "#hero-title",
        hero.title
    );

    setText(
        "#hero-description",
        hero.description
    );

    setText(
        "#profile-name",
        personal.name
    );

    setText(
        "#profile-role",
        personal.role
    );

    setText(
        "#profile-location",
        `📍 ${personal.location}`
    );

    const profileImage =
        getElement("#profile-image");

    if (profileImage) {

        profileImage.src =
            personal.profileImage;

        profileImage.alt =
            `${personal.name} profile photo`;
    }


    /* Open to work */

    const statusBadge =
        getElement("#open-to-work-badge");

    const statusText =
        getElement("#open-to-work-text");

    if (personal.openToWork) {

        statusText.textContent =
            personal.openToWorkLabel ||
            "Open to Work";

    } else {

        statusBadge.style.display =
            "none";
    }


    /* Hero quick links */

    const quickLinks =
        getElement("#hero-quick-links");

    quickLinks.innerHTML = "";

    (contact.links || [])
        .slice(0, 5)
        .forEach((item) => {

            const link =
                createLink(
                    item.url,
                    `${item.icon || ""} ${item.label}`,
                    "quick-link"
                );

            quickLinks.appendChild(link);
        });


    /* Profile stats */

    const stats =
        getElement("#profile-stats");

    stats.innerHTML = "";

    (hero.stats || [])
        .forEach((stat) => {

            const wrapper =
                createElement(
                    "div",
                    "profile-stat"
                );

            const value =
                createElement(
                    "span",
                    "profile-stat__value",
                    stat.value
                );

            const label =
                createElement(
                    "span",
                    "profile-stat__label",
                    stat.label
                );

            wrapper.append(
                value,
                label
            );

            stats.appendChild(wrapper);
        });
}


/* =========================================================
   ABOUT
========================================================= */

function renderAbout() {

    const about =
        portfolioData.about;

    setText(
        "#about-title",
        about.title
    );

    setText(
        "#about-description",
        about.subtitle
    );


    const content =
        getElement("#about-content");

    content.innerHTML = "";

    (about.paragraphs || [])
        .forEach((paragraph) => {

            const element =
                createElement(
                    "p",
                    "",
                    paragraph
                );

            content.appendChild(element);
        });


    const highlights =
        getElement("#about-highlights");

    highlights.innerHTML = "";

    (about.highlights || [])
        .forEach((highlight) => {

            const card =
                createElement(
                    "article",
                    "highlight-card"
                );

            const value =
                createElement(
                    "span",
                    "highlight-card__value",
                    highlight.value
                );

            const label =
                createElement(
                    "span",
                    "highlight-card__label",
                    highlight.label
                );

            card.append(
                value,
                label
            );

            highlights.appendChild(card);
        });
}


/* =========================================================
   EDUCATION
========================================================= */

function renderEducation() {

    const container =
        getElement("#education-list");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    (portfolioData.education || [])
        .forEach((education) => {

            const card =
                createElement(
                    "article",
                    "education-card reveal"
                );

            const year =
                createElement(
                    "span",
                    "education-card__year",
                    education.period
                );

            const degree =
                createElement(
                    "h3",
                    "education-card__degree",
                    education.degree
                );

            const institution =
                createElement(
                    "p",
                    "education-card__institution",
                    education.institution
                );

            const details =
                createElement(
                    "div",
                    "education-card__details"
                );

            if (education.grade) {

                details.appendChild(
                    createElement(
                        "span",
                        "education-tag",
                        `Grade: ${education.grade}`
                    )
                );
            }

            if (education.location) {

                details.appendChild(
                    createElement(
                        "span",
                        "education-tag",
                        education.location
                    )
                );
            }

            card.append(
                year,
                degree,
                institution,
                details
            );

            container.appendChild(card);
        });
}


/* =========================================================
   EXPERIENCE
========================================================= */

function renderExperience() {

    const container =
        getElement("#career-timeline");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    (portfolioData.experience || [])
        .forEach((experience) => {

            const item =
                createElement(
                    "article",
                    "career-item reveal"
                );

            const dot =
                createElement(
                    "span",
                    "career-item__dot"
                );

            const card =
                createElement(
                    "div",
                    "career-item__card"
                );


            /* Header */

            const header =
                createElement(
                    "div",
                    "career-item__header"
                );

            const heading =
                createElement(
                    "div"
                );

            heading.append(
                createElement(
                    "h3",
                    "career-item__role",
                    experience.role
                ),

                createElement(
                    "p",
                    "career-item__company",
                    experience.company
                )
            );


            const duration =
                createElement(
                    "span",
                    "career-item__duration",
                    experience.duration
                );

            header.append(
                heading,
                duration
            );


            /* Period */

            const period =
                createElement(
                    "div",
                    "career-item__period",
                    experience.period
                );


            /* Description */

            const description =
                createElement(
                    "p",
                    "career-item__description",
                    experience.description
                );


            /* Responsibilities */

            const responsibilities =
                createElement(
                    "ul",
                    "career-item__responsibilities"
                );

            (experience.responsibilities || [])
                .forEach((responsibility) => {

                    const listItem =
                        createElement(
                            "li",
                            "career-item__responsibility",
                            responsibility
                        );

                    responsibilities.appendChild(
                        listItem
                    );
                });


            card.append(
                header,
                period,
                description,
                responsibilities
            );

            item.append(
                dot,
                card
            );

            container.appendChild(item);
        });
}


/* =========================================================
   SKILLS
========================================================= */

function renderSkills() {

    const container =
        getElement("#skills-grid");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    (portfolioData.skills || [])
        .forEach((category) => {

            const card =
                createElement(
                    "article",
                    "skill-category reveal"
                );

            const title =
                createElement(
                    "h3",
                    "skill-category__title",
                    category.category
                );

            const list =
                createElement(
                    "div",
                    "skill-list"
                );

            (category.items || [])
                .forEach((skill) => {

                    list.appendChild(
                        createElement(
                            "span",
                            "skill-item",
                            skill
                        )
                    );
                });

            card.append(
                title,
                list
            );

            container.appendChild(card);
        });
}


/* =========================================================
   PROJECTS
========================================================= */

function renderProjects() {

    const container =
        getElement("#projects-grid");

    if (!container) {
        return;
    }

    const projects =
        portfolioData.projects || [];

    container.innerHTML = "";

    setText(
        "#project-count",
        `${projects.length} projects`
    );


    projects.forEach((project) => {

        const card =
            createElement(
                "article",
                "project-card reveal"
            );


        /* Image */

        const imageWrapper =
            createElement(
                "div",
                "project-card__image-wrapper"
            );

        const image =
            document.createElement("img");

        image.className =
            "project-card__image";

        image.src =
            project.image;

        image.alt =
            project.imageAlt ||
            project.title;

        image.loading =
            "lazy";

        imageWrapper.appendChild(image);


        if (project.featured) {

            imageWrapper.appendChild(
                createElement(
                    "span",
                    "project-card__featured",
                    "Featured"
                )
            );
        }


        /* Content */

        const content =
            createElement(
                "div",
                "project-card__content"
            );

        content.appendChild(
            createElement(
                "span",
                "project-card__category",
                project.category
            )
        );

        content.appendChild(
            createElement(
                "h3",
                "project-card__title",
                project.title
            )
        );

        content.appendChild(
            createElement(
                "p",
                "project-card__description",
                project.description
            )
        );


        /* Technologies */

        const technologies =
            createElement(
                "div",
                "project-card__technologies"
            );

        (project.technologies || [])
            .forEach((technology) => {

                technologies.appendChild(
                    createElement(
                        "span",
                        "project-card__technology",
                        technology
                    )
                );
            });

        content.appendChild(
            technologies
        );


        /* Links */

        const links =
            createElement(
                "div",
                "project-card__links"
            );

        const projectLinks =
            project.links || {};

        if (projectLinks.github) {

            links.appendChild(
                createLink(
                    projectLinks.github,
                    "GitHub ↗",
                    "project-card__link"
                )
            );
        }

        if (projectLinks.live) {

            links.appendChild(
                createLink(
                    projectLinks.live,
                    "Live Demo ↗",
                    "project-card__link"
                )
            );
        }

        if (projectLinks.documentation) {

            links.appendChild(
                createLink(
                    projectLinks.document