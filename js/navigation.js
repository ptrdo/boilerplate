"use strict";

/** NAVIGATION
 *  Data for populating primary menu navigation.
 *  Consumed by "/app/components/menu/menu"
 *  Executed by "/app/shell/js/index"
 *
 *  NOTE: Modules are variably navigatable --
 *  sometimes in several ways and sometimes not at all.
 *  Dynamically prescribing a navigation menu is challenging,
 *  at least until user needs are better understood.
 */
var navigation = {
  "parentNode": null,
  "element": "menu",
  "attributes": {
    "class": "dropdown"
  },
  "childNodes": [{
    "element": "a",
    "content": "Home",
    "attributes": {
      "href": "#home/lessons/"
    }
  }, {
    "element": "a",
    "content": "Go to my to-do list",
    "attributes": {
      "href": "#home/lessons/todo"
    }
  }, {
    "attributes": {
      "class": "spacer"
    }
  }, {
    "element": "a",
    "content": "Getting started",
    "attributes": {
      "href": "#",
      "onclick": "return false;"
    },
    "childNodes": [
    {
        "element": "a",
        "content": "Introduction to this app",
        "attributes": {
          "href": "#intro",
          "title": "Introduction to the app functionality"
        }
      },
      {
        "element": "a",
        "content": "JSON and programming",
        "attributes": {
          "href": "#programming"
        }
      }
    ]
  }, {
    "element": "a",
    "content": "Introduction to modeling",
    "attributes": {
      "href": "#",
      "onclick": "return false;"
    },
    "childNodes": [
      {
        "element": "a",
        "content": "SIR models",
        "attributes": {
          "href": "#SIR-basics",
          "title": "the basics of SIR modeling"
        }
      }, {
        "element": "a",
        "content": "EMOD as an SIR model",
        "attributes": {
          "href": "#DTK-as-SIR",
          "title": "configure EMOD to parallel SIR dynamics"
        }
      }
    ]
  },{
    "element": "a",
    "content": "Population dynamics",
    "attributes": {
      "href": "#",
      "onclick": "return false;"
    },
    "childNodes": [
      {
        "element": "a",
        "content": "Population initialization",
        "attributes": {
          "href": "#PopulationInitialization",
          "title": "configuring an initial population"
        }
      }, {
        "element": "a",
        "content": "Vital dynamics",
        "attributes": {
          "href": "#VitalDynamics",
          "title": "configuring vital dynamics features"
        }
      }
    ]
  },{
    "element": "a",
    "content": "Transmission",
    "attributes": {
      "href": "#",
      "onclick": "return false;"
    },
    "childNodes": [
      {
        "element": "a",
        "content": "Intrahost infection",
        "attributes": {
          "href": "#intrahost",
          "title": "dynamics of infection and reinfection within a single host"
        }
      },
      {
        "element": "span",
        "content": "Outbreak",
        "attributes": {
          "title": "in development"
        }
      },
      {
        "element": "span",
        "content": "Population-level transmission",
        "attributes": {
          "title": "in development"
        }
      }
    ]
  },
  {
    "element": "a",
    "content": "Campaigns",
    "attributes": {
      "href": "#",
      "onclick": "return false;"
    },
    "childNodes": [
      {
        "element": "span",
        "content": "Campaign events",
        "attributes": {
          "title": "in development"
        }
      },
      {
        "element": "span",
        "content": "Interventions",
        "attributes": {
          "title": "in development"
        }
      }
    ]
  },{
    "element": "a",
    "content": "Model complexity",
    "attributes": {
      "href": "#",
      "onclick": "return false;"
    },
    "childNodes": [
      {
        "element": "span",
        "content": "Individual and node properties",
        "attributes": {
          "title": "in development"
        }
      },
      {
        "element": "span",
        "content": "Migration",
        "attributes": {
          "title": "in development"
        }
      },
      {
        "element": "span",
        "content": "Dtk-Tools",
        "attributes": {
          "title": "in development"
        }
      }
    ]
  },{
    "attributes": {
      "class": "spacer"
    }
  }, {
    "element": "a",
    "content": "Sign Out",
    "attributes": {
      "href": "#signout"
    }
  }]
};

export default navigation;