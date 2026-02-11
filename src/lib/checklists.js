/**
 * These are your default templates (MVP).
 * You can edit wording anytime without code changes later by moving templates to Firestore.
 */

export const TEMPLATES = {
  daily_pretrip: {
    title: "Daily Pre-Trip Inspection",
    subtitle: "Required before the first trip of the day. If anything is not OK, document it before continuing.",
    requireFinalCertification: true,
    // "Lock" safety items (hard stop if not OK)
    criticalItems: [
      "Tires inflated / no damage",
      "Wheels secure",
      "Lights working",
      "Ramp/lift deploys & stows (if applicable)",
      "Seatbelts working",
      "Fire extinguisher present / charged",
      "Wheelchair restraints functional",
      "No warning lights",
      "Brakes responsive",
      "Steering normal"
    ],
    sections: [
      { title: "Exterior", items: [
        "Tires inflated / no damage",
        "Wheels secure",
        "Lights working",
        "Mirrors clean",
        "Windshield clean",
        "Wipers working",
        "Doors operate properly",
        "Ramp/lift deploys & stows (if applicable)"
      ]},
      { title: "Interior", items: [
        "Seats clean / secure",
        "Seatbelts working",
        "Floor clear",
        "No odors/spills",
        "Climate control working",
        "First aid kit stocked",
        "Fire extinguisher present / charged"
      ]},
      { title: "Cleaning & Infection Control", items: [
        "Wipe high-touch areas",
        "Remove trash",
        "Check spills/stains",
        "Disinfect belts/buckles",
        "Clean windows/mirrors"
      ]},
      { title: "Safety & Equipment", items: [
        "Phone mount secure",
        "PPE stocked",
        "Wheelchair restraints functional"
      ]},
      { title: "Mechanical", items: [
        "Fuel > 1/2",
        "Oil normal",
        "No warning lights",
        "Brakes responsive",
        "Steering normal"
      ]}
    ]
  },

  cleaning: {
    title: "Cleaning Checklist",
    sections: [
      { title: "Start of Day", items: [
        "Wipe high-touch areas",
        "Remove trash",
        "Check spills/stains",
        "Disinfect belts/buckles",
        "Clean windows/mirrors"
      ]},
      { title: "Between Trips", items: [
        "Quick wipe",
        "Remove trash",
        "Check odors"
      ]},
      { title: "End of Day", items: [
        "Full disinfecting wipedown",
        "Mop/vacuum",
        "Clean ramp/lift",
        "Restock PPE",
        "Report damage / deep clean needs"
      ]}
    ]
  },

  monthly_ops_review: {
    title: "Monthly Operations & Safety Review",
    sections: [
      { title: "Vehicle Safety & Readiness", items: [
        "Preventive maintenance logs reviewed",
        "Tire condition and wear checked",
        "Wheelchair restraints inspected for wear or damage",
        "Ramp/lift functionality verified",
        "Fluid levels reviewed (oil, coolant, washer fluid)",
        "Safety equipment present and functional (fire extinguisher, first aid kit, PPE)"
      ]},
      { title: "Driver Readiness", items: [
        "Driver roster reviewed",
        "Driver license validity spot-checked",
        "Training gaps reviewed (HIPAA, FWA, ADA awareness)",
        "Incident/accident trends reviewed",
        "Driver performance concerns documented (if applicable)"
      ]},
      { title: "Operations Execution", items: [
        "Trip documentation accuracy reviewed",
        "No-show and cancellation documentation reviewed",
        "Dispatch/device functionality verified",
        "Cleaning and sanitation logs reviewed",
        "Infection-control supplies stocked"
      ]},
      { title: "Documentation & Reporting", items: [
        "Incident and accident reports reviewed",
        "Maintenance issues documented and tracked",
        "Driver communication logs reviewed (if applicable)",
        "Service complaints reviewed and addressed"
      ]},
      { title: "Risk Prevention", items: [
        "Repeat mechanical issues identified",
        "Preventable incident trends identified",
        "Corrective actions assigned and tracked",
        "No unresolved safety concerns"
      ]}
    ]
  }
}
