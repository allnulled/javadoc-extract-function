function extractJavadocData(text) {
		var REGEX_JAVADOC = /\/\*\*[^\n]*\n([\t ]*\*[\t ]*[^\n]*\n)+[\t ]*\*\//g;
		var REGEX_BEGINING_AND_ENDING = /^\/\*\*[\t ]*\n|\n[\t ]*\*+\/$/g;
		var REGEX_JAVADOC_LINE_BEGINING = /\n[\t ]*\*[\t ]?/g;
		var REGEX_JAVADOC_LINE_BEGINING_ATTRIBUTE = /^\@[a-zA-Z0-9\-\_\$]*/g;
		var REGEX_SPACES_EXTREMES = /^[\t\n ]*|[\t\n ]*$/g;
		var javadocComments = text.match(REGEX_JAVADOC);
		var javadocFileData = [];
		var appendToLast = function(obj, prop, item, isNew = false) {
				if (!obj[prop]) {
						obj[prop] = [];
				}
				if (isNew || (obj[prop].length === 0)) {
						obj[prop].push("");
				}
				obj[prop][obj[prop].length - 1] += item;
		};
		if (javadocComments) {
				javadocComments.forEach(function(javadocComment) {
						var javadocCommentClean = "\n" + javadocComment.replace(REGEX_BEGINING_AND_ENDING, "");
						var javadocLines = javadocCommentClean.split(REGEX_JAVADOC_LINE_BEGINING);
						var javadocCommentData = {
								default: []
						};
						var currentAttribute = "default";
						javadocLines.forEach(function(javadocLine) {
								var attributeMatch = javadocLine.match(REGEX_JAVADOC_LINE_BEGINING_ATTRIBUTE);
								if (attributeMatch) {
										currentAttribute = attributeMatch[0];
										appendToLast(javadocCommentData, currentAttribute, javadocLine.replace(REGEX_JAVADOC_LINE_BEGINING_ATTRIBUTE, ""), true);
								} else if (javadocLine === "") {
										appendToLast(javadocCommentData, currentAttribute, "\n" + javadocLine);
								} else {
										appendToLast(javadocCommentData, currentAttribute, "\n" + javadocLine);
								}
						});
						javadocFileData.push(javadocCommentData);
				});
		}
		return javadocFileData;
};