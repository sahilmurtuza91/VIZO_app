const countriesData = require('./countries.json');

const RE_DESIGNATION_OPTIONS = [
    'REALTOR®',
    'Real Estate Broker',
    'Accredited Buyer Representative (ABR)',
    'Certified Residential Specialist (CRS)',
];

const LICENSE_TYPE_OPTIONS = [
    'Salesperson License',
    'Broker License',
    'Associate Broker',
    'Managing Broker',
];

const STATE_OPTIONS = [
    'California',
    'Texas',
    'Florida',
    'New York',
    'Illinois',
];

const SPECIALTIES = [
    "Residential Properties",
    "Commercial Properties",
    "Luxury Real Estate",
    "Land & Plots",
    "Vacation Rentals",
    "Industrial Real Estate",
];

const LANGUAGES = [
    "English",
    "Spanish",
    "French",
    "Hindi",
    "Mandarin",
    "Arabic",
];

const PROPERTY_TYPES = [
    "Apartment",
    "Villa",
    "House",
    "Land",
];

const ISSUE_TYPES = [
    "Technical Issue",
    "Notification Issue",
    "Upload Issue",
    "Billing Issue",
    "Account Issue",
];

module.exports = {
    countriesData,
    RE_DESIGNATION_OPTIONS,
    LICENSE_TYPE_OPTIONS,
    STATE_OPTIONS,
    SPECIALTIES,
    LANGUAGES,
    PROPERTY_TYPES,
    ISSUE_TYPES,
};