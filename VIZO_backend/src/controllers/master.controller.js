const masterService = require("../services/master.service");

const getCountries = async (req, res) => {
  try {
    const countries = await masterService.getCountries();

    res.status(200).json({
      success: true,
      message: "Countries fetched successfully",
      data: countries,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  getCountries,
};
