const purgeTypes = {
  url: "URL Purge",
  hostname: "Host Purge",
  tag: "Tag Purge",
  custom: "Cache Key",
  json: "Json Purge",
  all: "Everything"
}

const PurgeLogSaveLimit = 200;
const APIKeyNumberLimit = 100;
const NumberOfLogsInSinglePage = 10;
const HoldOnDelay = 1000; // ms

const SuccessImage = "img/success.png";
const FailureImage = "img/fail.png";
const LogoImage = "img/logo.png";
const LogoImageBlack = "img/logo-black.png";
const KeyImage = "img/key.png";

const WelcomeMsg = "fdsafda";
const UpdateMsg = "fdsafdaupdate";

const purgeErrorCodeDesc = function(code) {
  const errorCodeDesc = {
    "1000":	"Invalid or missing user",
    "1001":	"Invalid zone identifier",
    "1002":	"Invalid domain",
    "1003":	"'jump_start' must be boolean",
    "1006":	"Invalid or missing zone",
    "1008":	"Invalid or missing Zone id",
    "1010":	"Bulk deal limit reached",
    "1012":	"Request must contain one of 'purge_everything', 'files', 'tags', or 'hosts'",
    "1013":	"'purge_everything' must be true",
    "1014":	"'files', 'tags', or 'hosts' must be an array",
    "1015":	"Unable to purge <url>",
    "1016":	"Unable to purge any urls",
    "1017":	"Unable to purge all",
    "1018":	"Invalid zone status",
    "1019":	"Zone is already paused",
    "1020":	"Invalid or missing zone",
    "1021":	"Invalid zone status",
    "1022":	"Zone is already unpaused",
    "1023":	"Invalid or missing zone",
    "1049":	"<domain> is not a registered domain",
    "1050":	"<domain> is currently being tasted. It is not currently a registered domain",
    "1051":	"Cloudflare is already hosting <domain>",
    "1052":	"An error has occurred and it has been logged. We will fix this problem promptly. We apologize for the inconvenience",
    "1055":	"Failed to disable <domain>",
    "1056":	"preserve_ini must be a boolean",
    "1057":	"Zone must be in 'initializing' status",
    "1059":	"Unable to delete zone",
    "1061":	"<domain> already exists",
    "1064":	"Not allowed to update zone step. Bad zone status",
    "1065":	"Not allowed to update zone step. Zone has already been set up",
    "1066":	"Could not promote zone to step 3",
    "1067":	"Invalid organization identifier passed in your organization variable",
    "1068":	"Permission denied",
    "1069":	"organization variable should be an organization object",
    "1070":	"This operation requires a Business or Enterprise account.",
    "1071":	"Vanity name server array expected.",
    "1073":	"A name server provided is in the wrong format.",
    "1074":	"Could not find a valid zone.",
    "1075":	"Vanity name server array count is invalid",
    "1076":	"Name servers have invalid IP addresses",
    "1077":	"Could not find a valid zone.",
    "1078":	"This zone has no valid vanity IPs.",
    "1079":	"This zone has no valid vanity name servers.",
    "1080":	"There is a conflict with one of the name servers.",
    "1081":	"There are no valid vanity name servers to disable.",
    "1082":	"Unable to purge '<url>'. You can only purge files for this zone",
    "1083":	"Unable to purge '<url>'. Rate limit reached. Please wait if you need to perform more operations",
    "1084":	"Unable to purge '<url>'.",
    "1085":	"Only one property can be updated at a time",
    "1086":	"Invalid property",
    "1088":	"Invalid/Missing Zone plan ID",
    "1089":	"Invalid/Missing Zone plan ID",
    "1092":	"Request cannot contain 'purge_everything' and any of 'files', 'tags', or 'hosts'",
    "1094":	"Exceeded maximum amount of 500 files that can be purged on a single request",
    "1095":	"Sorry, you do not have access to purge cache for that zone id or that zone id is invalid",
    "1096":	"This action is not available as your zone has been deactivated for a possible Terms of Service violation",
    "1097":	"This zone is banned and cannot be added to Cloudflare at this time, please contact Cloudflare Support",
    "1098":	"This zone is temporarily banned and cannot be added to Cloudflare at this time, please contact Cloudflare Support",
    "1099":	"We were unable to identify <domain> as a registered domain. Please ensure you are providing the root domain and not any subdomains (e.g., example.com, not subdomain.example.com)",
    "1100":	"Tag exceeds maximum length of 1024 characters",
    "1101":	"Exceeded maximum amount of 30 tags that can be purged on a single request",
    "1102":	"Unable to purge by tag, rate limit reached. Please wait if you need to perform more",
    "1104":	"Partial zone signup not allowed",
    "1105":	"This zone is temporarily banned and cannot be added to Cloudflare at this time, please contact Cloudflare Support",
    "1106":	"Sorry, you are not allowed to create new zones. Please contact support.",
    "1107":	"Only enterprise zones can purge by tag.",
    "1108":	"Unable to update domain subscription. Please contact support for assistance.",
    "1109":	"Unable to update domain subscription. Please contact support for assistance.",
    "1110":	"Failed to lookup registrar and hosting information of <domain> at this time. Please contact Cloudflare Support or try again later.",
    "1111":	"Exceeded maximum amount of 30 hosts that can be purged on a single request",
    "1112":	"Only enterprise zones can purge by host",
    "1113":	"Unable to purge by host, rate limit reached. Please wait if you need to perform more operations.",
    "1114":	"Host exceeds maximum length of 200 characters",
    "1115":	"Invalid host",
    "7000": "No route for that URI",
    "7003": "Could not route to the requested URL"
  }
  return errorCodeDesc[code] == undefined ? "Errorcode is not defined" : errorCodeDesc[code];
}
