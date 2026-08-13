const asyncHandler = require("../utils/AsyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const lookupData = require("../data/lookupData");

const getAllLookupData = asyncHandler(async (req, res, next) => {
    return sendSuccess(res, 200, "Master lookup data fetched successfully.", {
        designations: lookupData.RE_DESIGNATION_OPTIONS,
        licenseTypes: lookupData.LICENSE_TYPE_OPTIONS,
        states: lookupData.STATE_OPTIONS,
        specialties: lookupData.SPECIALTIES,
        languages: lookupData.LANGUAGES,
        propertyTypes: lookupData.PROPERTY_TYPES,
        issueTypes: lookupData.ISSUE_TYPES,
        countries: lookupData.countriesData || [],
    });
});

module.exports = {
    getAllLookupData,
};