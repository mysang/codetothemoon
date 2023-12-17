import './chunks/astro_n3zJQivy.mjs';

if (typeof process !== "undefined") {
  let proc = process;
  if ("argv" in proc && Array.isArray(proc.argv)) {
    if (proc.argv.includes("--verbose")) ; else if (proc.argv.includes("--silent")) ; else ;
  }
}

/**
 * Tokenize input string.
 */
function lexer(str) {
    var tokens = [];
    var i = 0;
    while (i < str.length) {
        var char = str[i];
        if (char === "*" || char === "+" || char === "?") {
            tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
            continue;
        }
        if (char === "\\") {
            tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
            continue;
        }
        if (char === "{") {
            tokens.push({ type: "OPEN", index: i, value: str[i++] });
            continue;
        }
        if (char === "}") {
            tokens.push({ type: "CLOSE", index: i, value: str[i++] });
            continue;
        }
        if (char === ":") {
            var name = "";
            var j = i + 1;
            while (j < str.length) {
                var code = str.charCodeAt(j);
                if (
                // `0-9`
                (code >= 48 && code <= 57) ||
                    // `A-Z`
                    (code >= 65 && code <= 90) ||
                    // `a-z`
                    (code >= 97 && code <= 122) ||
                    // `_`
                    code === 95) {
                    name += str[j++];
                    continue;
                }
                break;
            }
            if (!name)
                throw new TypeError("Missing parameter name at ".concat(i));
            tokens.push({ type: "NAME", index: i, value: name });
            i = j;
            continue;
        }
        if (char === "(") {
            var count = 1;
            var pattern = "";
            var j = i + 1;
            if (str[j] === "?") {
                throw new TypeError("Pattern cannot start with \"?\" at ".concat(j));
            }
            while (j < str.length) {
                if (str[j] === "\\") {
                    pattern += str[j++] + str[j++];
                    continue;
                }
                if (str[j] === ")") {
                    count--;
                    if (count === 0) {
                        j++;
                        break;
                    }
                }
                else if (str[j] === "(") {
                    count++;
                    if (str[j + 1] !== "?") {
                        throw new TypeError("Capturing groups are not allowed at ".concat(j));
                    }
                }
                pattern += str[j++];
            }
            if (count)
                throw new TypeError("Unbalanced pattern at ".concat(i));
            if (!pattern)
                throw new TypeError("Missing pattern at ".concat(i));
            tokens.push({ type: "PATTERN", index: i, value: pattern });
            i = j;
            continue;
        }
        tokens.push({ type: "CHAR", index: i, value: str[i++] });
    }
    tokens.push({ type: "END", index: i, value: "" });
    return tokens;
}
/**
 * Parse a string for the raw tokens.
 */
function parse(str, options) {
    if (options === void 0) { options = {}; }
    var tokens = lexer(str);
    var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a;
    var defaultPattern = "[^".concat(escapeString(options.delimiter || "/#?"), "]+?");
    var result = [];
    var key = 0;
    var i = 0;
    var path = "";
    var tryConsume = function (type) {
        if (i < tokens.length && tokens[i].type === type)
            return tokens[i++].value;
    };
    var mustConsume = function (type) {
        var value = tryConsume(type);
        if (value !== undefined)
            return value;
        var _a = tokens[i], nextType = _a.type, index = _a.index;
        throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
    };
    var consumeText = function () {
        var result = "";
        var value;
        while ((value = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR"))) {
            result += value;
        }
        return result;
    };
    while (i < tokens.length) {
        var char = tryConsume("CHAR");
        var name = tryConsume("NAME");
        var pattern = tryConsume("PATTERN");
        if (name || pattern) {
            var prefix = char || "";
            if (prefixes.indexOf(prefix) === -1) {
                path += prefix;
                prefix = "";
            }
            if (path) {
                result.push(path);
                path = "";
            }
            result.push({
                name: name || key++,
                prefix: prefix,
                suffix: "",
                pattern: pattern || defaultPattern,
                modifier: tryConsume("MODIFIER") || "",
            });
            continue;
        }
        var value = char || tryConsume("ESCAPED_CHAR");
        if (value) {
            path += value;
            continue;
        }
        if (path) {
            result.push(path);
            path = "";
        }
        var open = tryConsume("OPEN");
        if (open) {
            var prefix = consumeText();
            var name_1 = tryConsume("NAME") || "";
            var pattern_1 = tryConsume("PATTERN") || "";
            var suffix = consumeText();
            mustConsume("CLOSE");
            result.push({
                name: name_1 || (pattern_1 ? key++ : ""),
                pattern: name_1 && !pattern_1 ? defaultPattern : pattern_1,
                prefix: prefix,
                suffix: suffix,
                modifier: tryConsume("MODIFIER") || "",
            });
            continue;
        }
        mustConsume("END");
    }
    return result;
}
/**
 * Compile a string to a template function for the path.
 */
function compile(str, options) {
    return tokensToFunction(parse(str, options), options);
}
/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction(tokens, options) {
    if (options === void 0) { options = {}; }
    var reFlags = flags(options);
    var _a = options.encode, encode = _a === void 0 ? function (x) { return x; } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
    // Compile all the tokens into regexps.
    var matches = tokens.map(function (token) {
        if (typeof token === "object") {
            return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
        }
    });
    return function (data) {
        var path = "";
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            if (typeof token === "string") {
                path += token;
                continue;
            }
            var value = data ? data[token.name] : undefined;
            var optional = token.modifier === "?" || token.modifier === "*";
            var repeat = token.modifier === "*" || token.modifier === "+";
            if (Array.isArray(value)) {
                if (!repeat) {
                    throw new TypeError("Expected \"".concat(token.name, "\" to not repeat, but got an array"));
                }
                if (value.length === 0) {
                    if (optional)
                        continue;
                    throw new TypeError("Expected \"".concat(token.name, "\" to not be empty"));
                }
                for (var j = 0; j < value.length; j++) {
                    var segment = encode(value[j], token);
                    if (validate && !matches[i].test(segment)) {
                        throw new TypeError("Expected all \"".concat(token.name, "\" to match \"").concat(token.pattern, "\", but got \"").concat(segment, "\""));
                    }
                    path += token.prefix + segment + token.suffix;
                }
                continue;
            }
            if (typeof value === "string" || typeof value === "number") {
                var segment = encode(String(value), token);
                if (validate && !matches[i].test(segment)) {
                    throw new TypeError("Expected \"".concat(token.name, "\" to match \"").concat(token.pattern, "\", but got \"").concat(segment, "\""));
                }
                path += token.prefix + segment + token.suffix;
                continue;
            }
            if (optional)
                continue;
            var typeOfMessage = repeat ? "an array" : "a string";
            throw new TypeError("Expected \"".concat(token.name, "\" to be ").concat(typeOfMessage));
        }
        return path;
    };
}
/**
 * Escape a regular expression string.
 */
function escapeString(str) {
    return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
/**
 * Get the flags for a regexp from the options.
 */
function flags(options) {
    return options && options.sensitive ? "" : "i";
}

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return toPath;
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    })
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  return {
    ...serializedManifest,
    assets,
    componentMetadata,
    clientDirectives,
    routes
  };
}

const manifest = deserializeManifest({"adapterName":"","routes":[{"file":"","links":[],"scripts":[],"styles":[{"type":"inline","content":":root{--accent: #2337ff;--accent-dark: #000d8a;--black: 15, 18, 25;--gray: 96, 115, 159;--gray-light: 229, 233, 240;--gray-dark: 34, 41, 57;--gray-gradient: rgba(var(--gray-light), 50%), #fff;--box-shadow: 0 2px 6px rgba(var(--gray), 25%), 0 8px 24px rgba(var(--gray), 33%), 0 16px 32px rgba(var(--gray), 33%)}@font-face{font-family:Atkinson;src:url(/fonts/atkinson-regular.woff) format(\"woff\");font-weight:400;font-style:normal;font-display:swap}@font-face{font-family:Atkinson;src:url(/fonts/atkinson-bold.woff) format(\"woff\");font-weight:700;font-style:normal;font-display:swap}body{font-family:Atkinson,sans-serif;margin:0;padding:0;text-align:left;background:linear-gradient(var(--gray-gradient)) no-repeat;background-size:100% 600px;word-wrap:break-word;overflow-wrap:break-word;color:rgb(var(--gray-dark));font-size:20px;line-height:1.7}main{width:720px;max-width:calc(100% - 2em);margin:auto;padding:3em 1em}h1,h2,h3,h4,h5,h6{margin:0 0 .5rem;color:rgb(var(--black));line-height:1.2}h1{font-size:3.052em}h2{font-size:2.441em}h3{font-size:1.953em}h4{font-size:1.563em}h5{font-size:1.25em}strong,b{font-weight:700}a,a:hover{color:var(--accent)}p{margin-bottom:1em}.prose p{margin-bottom:2em}textarea{width:100%;font-size:16px}input{font-size:16px}table{width:100%}img{max-width:100%;height:auto;border-radius:8px}code{padding:2px 5px;background-color:rgb(var(--gray-light));border-radius:2px}pre{padding:1.5em;border-radius:8px}pre>code{all:unset}blockquote{border-left:4px solid var(--accent);padding:0 0 0 20px;margin:0;font-size:1.333em}hr{border:none;border-top:1px solid rgb(var(--gray-light))}@media (max-width: 720px){body{font-size:18px}main{padding:1em}}.sr-only{border:0;padding:0;margin:0;position:absolute!important;height:1px;width:1px;overflow:hidden;clip:rect(1px 1px 1px 1px);clip:rect(1px,1px,1px,1px);clip-path:inset(50%);white-space:nowrap}header[data-astro-cid-3ef6ksr2]{margin:0;padding:0 1em;background:#fff;box-shadow:0 2px 8px rgba(var(--black),5%)}h2[data-astro-cid-3ef6ksr2]{margin:0;font-size:1em}h2[data-astro-cid-3ef6ksr2] a[data-astro-cid-3ef6ksr2],h2[data-astro-cid-3ef6ksr2] a[data-astro-cid-3ef6ksr2].active{text-decoration:none}nav[data-astro-cid-3ef6ksr2]{display:flex;align-items:center;justify-content:space-between}nav[data-astro-cid-3ef6ksr2] a[data-astro-cid-3ef6ksr2]{padding:1em .5em;color:var(--black);border-bottom:4px solid transparent;text-decoration:none}nav[data-astro-cid-3ef6ksr2] a[data-astro-cid-3ef6ksr2].active{text-decoration:none;border-bottom-color:var(--accent)}.social-links[data-astro-cid-3ef6ksr2],.social-links[data-astro-cid-3ef6ksr2] a[data-astro-cid-3ef6ksr2]{display:flex}@media (max-width: 720px){.social-links[data-astro-cid-3ef6ksr2]{display:none}}footer[data-astro-cid-sz7xmlte]{padding:2em 1em 6em;background:linear-gradient(var(--gray-gradient)) no-repeat;color:rgb(var(--gray));text-align:center}.social-links[data-astro-cid-sz7xmlte]{display:flex;justify-content:center;gap:1em;margin-top:1em}.social-links[data-astro-cid-sz7xmlte] a[data-astro-cid-sz7xmlte]{text-decoration:none;color:rgb(var(--gray))}.social-links[data-astro-cid-sz7xmlte] a[data-astro-cid-sz7xmlte]:hover{color:rgb(var(--gray-dark))}\na[data-astro-cid-eimmu3lg]{display:inline-block;text-decoration:none}a[data-astro-cid-eimmu3lg].active{font-weight:bolder;text-decoration:underline}\n"}],"routeData":{"route":"/","type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/rss.xml","type":"endpoint","pattern":"^\\/rss\\.xml$","segments":[[{"content":"rss.xml","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/rss.xml.js","pathname":"/rss.xml","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"inline","content":":root{--accent: #2337ff;--accent-dark: #000d8a;--black: 15, 18, 25;--gray: 96, 115, 159;--gray-light: 229, 233, 240;--gray-dark: 34, 41, 57;--gray-gradient: rgba(var(--gray-light), 50%), #fff;--box-shadow: 0 2px 6px rgba(var(--gray), 25%), 0 8px 24px rgba(var(--gray), 33%), 0 16px 32px rgba(var(--gray), 33%)}@font-face{font-family:Atkinson;src:url(/fonts/atkinson-regular.woff) format(\"woff\");font-weight:400;font-style:normal;font-display:swap}@font-face{font-family:Atkinson;src:url(/fonts/atkinson-bold.woff) format(\"woff\");font-weight:700;font-style:normal;font-display:swap}body{font-family:Atkinson,sans-serif;margin:0;padding:0;text-align:left;background:linear-gradient(var(--gray-gradient)) no-repeat;background-size:100% 600px;word-wrap:break-word;overflow-wrap:break-word;color:rgb(var(--gray-dark));font-size:20px;line-height:1.7}main{width:720px;max-width:calc(100% - 2em);margin:auto;padding:3em 1em}h1,h2,h3,h4,h5,h6{margin:0 0 .5rem;color:rgb(var(--black));line-height:1.2}h1{font-size:3.052em}h2{font-size:2.441em}h3{font-size:1.953em}h4{font-size:1.563em}h5{font-size:1.25em}strong,b{font-weight:700}a,a:hover{color:var(--accent)}p{margin-bottom:1em}.prose p{margin-bottom:2em}textarea{width:100%;font-size:16px}input{font-size:16px}table{width:100%}img{max-width:100%;height:auto;border-radius:8px}code{padding:2px 5px;background-color:rgb(var(--gray-light));border-radius:2px}pre{padding:1.5em;border-radius:8px}pre>code{all:unset}blockquote{border-left:4px solid var(--accent);padding:0 0 0 20px;margin:0;font-size:1.333em}hr{border:none;border-top:1px solid rgb(var(--gray-light))}@media (max-width: 720px){body{font-size:18px}main{padding:1em}}.sr-only{border:0;padding:0;margin:0;position:absolute!important;height:1px;width:1px;overflow:hidden;clip:rect(1px 1px 1px 1px);clip:rect(1px,1px,1px,1px);clip-path:inset(50%);white-space:nowrap}header[data-astro-cid-3ef6ksr2]{margin:0;padding:0 1em;background:#fff;box-shadow:0 2px 8px rgba(var(--black),5%)}h2[data-astro-cid-3ef6ksr2]{margin:0;font-size:1em}h2[data-astro-cid-3ef6ksr2] a[data-astro-cid-3ef6ksr2],h2[data-astro-cid-3ef6ksr2] a[data-astro-cid-3ef6ksr2].active{text-decoration:none}nav[data-astro-cid-3ef6ksr2]{display:flex;align-items:center;justify-content:space-between}nav[data-astro-cid-3ef6ksr2] a[data-astro-cid-3ef6ksr2]{padding:1em .5em;color:var(--black);border-bottom:4px solid transparent;text-decoration:none}nav[data-astro-cid-3ef6ksr2] a[data-astro-cid-3ef6ksr2].active{text-decoration:none;border-bottom-color:var(--accent)}.social-links[data-astro-cid-3ef6ksr2],.social-links[data-astro-cid-3ef6ksr2] a[data-astro-cid-3ef6ksr2]{display:flex}@media (max-width: 720px){.social-links[data-astro-cid-3ef6ksr2]{display:none}}footer[data-astro-cid-sz7xmlte]{padding:2em 1em 6em;background:linear-gradient(var(--gray-gradient)) no-repeat;color:rgb(var(--gray));text-align:center}.social-links[data-astro-cid-sz7xmlte]{display:flex;justify-content:center;gap:1em;margin-top:1em}.social-links[data-astro-cid-sz7xmlte] a[data-astro-cid-sz7xmlte]{text-decoration:none;color:rgb(var(--gray))}.social-links[data-astro-cid-sz7xmlte] a[data-astro-cid-sz7xmlte]:hover{color:rgb(var(--gray-dark))}\na[data-astro-cid-eimmu3lg]{display:inline-block;text-decoration:none}a[data-astro-cid-eimmu3lg].active{font-weight:bolder;text-decoration:underline}\nmain[data-astro-cid-bvzihdzo]{width:calc(100% - 2em);max-width:100%;margin:0}.hero-image[data-astro-cid-bvzihdzo]{width:100%}.hero-image[data-astro-cid-bvzihdzo] img[data-astro-cid-bvzihdzo]{display:block;margin:0 auto;border-radius:12px;box-shadow:var(--box-shadow)}.prose[data-astro-cid-bvzihdzo]{width:720px;max-width:calc(100% - 2em);margin:auto;padding:1em;color:rgb(var(--gray-dark))}.title[data-astro-cid-bvzihdzo]{margin-bottom:1em;padding:1em 0;text-align:center;line-height:1}.title[data-astro-cid-bvzihdzo] h1[data-astro-cid-bvzihdzo]{margin:0 0 .5em}.date[data-astro-cid-bvzihdzo]{margin-bottom:.5em;color:rgb(var(--gray))}.last-updated-on[data-astro-cid-bvzihdzo]{font-style:italic}\n"}],"routeData":{"route":"/about","type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"inline","content":":root{--accent: #2337ff;--accent-dark: #000d8a;--black: 15, 18, 25;--gray: 96, 115, 159;--gray-light: 229, 233, 240;--gray-dark: 34, 41, 57;--gray-gradient: rgba(var(--gray-light), 50%), #fff;--box-shadow: 0 2px 6px rgba(var(--gray), 25%), 0 8px 24px rgba(var(--gray), 33%), 0 16px 32px rgba(var(--gray), 33%)}@font-face{font-family:Atkinson;src:url(/fonts/atkinson-regular.woff) format(\"woff\");font-weight:400;font-style:normal;font-display:swap}@font-face{font-family:Atkinson;src:url(/fonts/atkinson-bold.woff) format(\"woff\");font-weight:700;font-style:normal;font-display:swap}body{font-family:Atkinson,sans-serif;margin:0;padding:0;text-align:left;background:linear-gradient(var(--gray-gradient)) no-repeat;background-size:100% 600px;word-wrap:break-word;overflow-wrap:break-word;color:rgb(var(--gray-dark));font-size:20px;line-height:1.7}main{width:720px;max-width:calc(100% - 2em);margin:auto;padding:3em 1em}h1,h2,h3,h4,h5,h6{margin:0 0 .5rem;color:rgb(var(--black));line-height:1.2}h1{font-size:3.052em}h2{font-size:2.441em}h3{font-size:1.953em}h4{font-size:1.563em}h5{font-size:1.25em}strong,b{font-weight:700}a,a:hover{color:var(--accent)}p{margin-bottom:1em}.prose p{margin-bottom:2em}textarea{width:100%;font-size:16px}input{font-size:16px}table{width:100%}img{max-width:100%;height:auto;border-radius:8px}code{padding:2px 5px;background-color:rgb(var(--gray-light));border-radius:2px}pre{padding:1.5em;border-radius:8px}pre>code{all:unset}blockquote{border-left:4px solid var(--accent);padding:0 0 0 20px;margin:0;font-size:1.333em}hr{border:none;border-top:1px solid rgb(var(--gray-light))}@media (max-width: 720px){body{font-size:18px}main{padding:1em}}.sr-only{border:0;padding:0;margin:0;position:absolute!important;height:1px;width:1px;overflow:hidden;clip:rect(1px 1px 1px 1px);clip:rect(1px,1px,1px,1px);clip-path:inset(50%);white-space:nowrap}header[data-astro-cid-3ef6ksr2]{margin:0;padding:0 1em;background:#fff;box-shadow:0 2px 8px rgba(var(--black),5%)}h2[data-astro-cid-3ef6ksr2]{margin:0;font-size:1em}h2[data-astro-cid-3ef6ksr2] a[data-astro-cid-3ef6ksr2],h2[data-astro-cid-3ef6ksr2] a[data-astro-cid-3ef6ksr2].active{text-decoration:none}nav[data-astro-cid-3ef6ksr2]{display:flex;align-items:center;justify-content:space-between}nav[data-astro-cid-3ef6ksr2] a[data-astro-cid-3ef6ksr2]{padding:1em .5em;color:var(--black);border-bottom:4px solid transparent;text-decoration:none}nav[data-astro-cid-3ef6ksr2] a[data-astro-cid-3ef6ksr2].active{text-decoration:none;border-bottom-color:var(--accent)}.social-links[data-astro-cid-3ef6ksr2],.social-links[data-astro-cid-3ef6ksr2] a[data-astro-cid-3ef6ksr2]{display:flex}@media (max-width: 720px){.social-links[data-astro-cid-3ef6ksr2]{display:none}}footer[data-astro-cid-sz7xmlte]{padding:2em 1em 6em;background:linear-gradient(var(--gray-gradient)) no-repeat;color:rgb(var(--gray));text-align:center}.social-links[data-astro-cid-sz7xmlte]{display:flex;justify-content:center;gap:1em;margin-top:1em}.social-links[data-astro-cid-sz7xmlte] a[data-astro-cid-sz7xmlte]{text-decoration:none;color:rgb(var(--gray))}.social-links[data-astro-cid-sz7xmlte] a[data-astro-cid-sz7xmlte]:hover{color:rgb(var(--gray-dark))}\na[data-astro-cid-eimmu3lg]{display:inline-block;text-decoration:none}a[data-astro-cid-eimmu3lg].active{font-weight:bolder;text-decoration:underline}\nmain[data-astro-cid-5tznm7mj]{width:960px}ul[data-astro-cid-5tznm7mj]{display:flex;flex-wrap:wrap;gap:2rem;list-style-type:none;margin:0;padding:0}ul[data-astro-cid-5tznm7mj] li[data-astro-cid-5tznm7mj]{width:calc(50% - 1rem)}ul[data-astro-cid-5tznm7mj] li[data-astro-cid-5tznm7mj] [data-astro-cid-5tznm7mj]{text-decoration:none;transition:.2s ease}ul[data-astro-cid-5tznm7mj] li[data-astro-cid-5tznm7mj]:first-child{width:100%;margin-bottom:1rem;text-align:center}ul[data-astro-cid-5tznm7mj] li[data-astro-cid-5tznm7mj]:first-child img[data-astro-cid-5tznm7mj]{width:100%}ul[data-astro-cid-5tznm7mj] li[data-astro-cid-5tznm7mj]:first-child .title[data-astro-cid-5tznm7mj]{font-size:2.369rem}ul[data-astro-cid-5tznm7mj] li[data-astro-cid-5tznm7mj] img[data-astro-cid-5tznm7mj]{margin-bottom:.5rem;border-radius:12px}ul[data-astro-cid-5tznm7mj] li[data-astro-cid-5tznm7mj] a[data-astro-cid-5tznm7mj]{display:block}.title[data-astro-cid-5tznm7mj]{margin:0;color:rgb(var(--black));line-height:1}.date[data-astro-cid-5tznm7mj]{margin:0;color:rgb(var(--gray))}ul[data-astro-cid-5tznm7mj] li[data-astro-cid-5tznm7mj] a[data-astro-cid-5tznm7mj]:hover h4[data-astro-cid-5tznm7mj],ul[data-astro-cid-5tznm7mj] li[data-astro-cid-5tznm7mj] a[data-astro-cid-5tznm7mj]:hover .date[data-astro-cid-5tznm7mj]{color:rgb(var(--accent))}ul[data-astro-cid-5tznm7mj] a[data-astro-cid-5tznm7mj]:hover img[data-astro-cid-5tznm7mj]{box-shadow:var(--box-shadow)}@media (max-width: 720px){ul[data-astro-cid-5tznm7mj]{gap:.5em}ul[data-astro-cid-5tznm7mj] li[data-astro-cid-5tznm7mj]{width:100%;text-align:center}ul[data-astro-cid-5tznm7mj] li[data-astro-cid-5tznm7mj]:first-child{margin-bottom:0}ul[data-astro-cid-5tznm7mj] li[data-astro-cid-5tznm7mj]:first-child .title[data-astro-cid-5tznm7mj]{font-size:1.563em}}\n"}],"routeData":{"route":"/blog","type":"page","pattern":"^\\/blog\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blog/index.astro","pathname":"/blog","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"inline","content":":root{--accent: #2337ff;--accent-dark: #000d8a;--black: 15, 18, 25;--gray: 96, 115, 159;--gray-light: 229, 233, 240;--gray-dark: 34, 41, 57;--gray-gradient: rgba(var(--gray-light), 50%), #fff;--box-shadow: 0 2px 6px rgba(var(--gray), 25%), 0 8px 24px rgba(var(--gray), 33%), 0 16px 32px rgba(var(--gray), 33%)}@font-face{font-family:Atkinson;src:url(/fonts/atkinson-regular.woff) format(\"woff\");font-weight:400;font-style:normal;font-display:swap}@font-face{font-family:Atkinson;src:url(/fonts/atkinson-bold.woff) format(\"woff\");font-weight:700;font-style:normal;font-display:swap}body{font-family:Atkinson,sans-serif;margin:0;padding:0;text-align:left;background:linear-gradient(var(--gray-gradient)) no-repeat;background-size:100% 600px;word-wrap:break-word;overflow-wrap:break-word;color:rgb(var(--gray-dark));font-size:20px;line-height:1.7}main{width:720px;max-width:calc(100% - 2em);margin:auto;padding:3em 1em}h1,h2,h3,h4,h5,h6{margin:0 0 .5rem;color:rgb(var(--black));line-height:1.2}h1{font-size:3.052em}h2{font-size:2.441em}h3{font-size:1.953em}h4{font-size:1.563em}h5{font-size:1.25em}strong,b{font-weight:700}a,a:hover{color:var(--accent)}p{margin-bottom:1em}.prose p{margin-bottom:2em}textarea{width:100%;font-size:16px}input{font-size:16px}table{width:100%}img{max-width:100%;height:auto;border-radius:8px}code{padding:2px 5px;background-color:rgb(var(--gray-light));border-radius:2px}pre{padding:1.5em;border-radius:8px}pre>code{all:unset}blockquote{border-left:4px solid var(--accent);padding:0 0 0 20px;margin:0;font-size:1.333em}hr{border:none;border-top:1px solid rgb(var(--gray-light))}@media (max-width: 720px){body{font-size:18px}main{padding:1em}}.sr-only{border:0;padding:0;margin:0;position:absolute!important;height:1px;width:1px;overflow:hidden;clip:rect(1px 1px 1px 1px);clip:rect(1px,1px,1px,1px);clip-path:inset(50%);white-space:nowrap}header[data-astro-cid-3ef6ksr2]{margin:0;padding:0 1em;background:#fff;box-shadow:0 2px 8px rgba(var(--black),5%)}h2[data-astro-cid-3ef6ksr2]{margin:0;font-size:1em}h2[data-astro-cid-3ef6ksr2] a[data-astro-cid-3ef6ksr2],h2[data-astro-cid-3ef6ksr2] a[data-astro-cid-3ef6ksr2].active{text-decoration:none}nav[data-astro-cid-3ef6ksr2]{display:flex;align-items:center;justify-content:space-between}nav[data-astro-cid-3ef6ksr2] a[data-astro-cid-3ef6ksr2]{padding:1em .5em;color:var(--black);border-bottom:4px solid transparent;text-decoration:none}nav[data-astro-cid-3ef6ksr2] a[data-astro-cid-3ef6ksr2].active{text-decoration:none;border-bottom-color:var(--accent)}.social-links[data-astro-cid-3ef6ksr2],.social-links[data-astro-cid-3ef6ksr2] a[data-astro-cid-3ef6ksr2]{display:flex}@media (max-width: 720px){.social-links[data-astro-cid-3ef6ksr2]{display:none}}footer[data-astro-cid-sz7xmlte]{padding:2em 1em 6em;background:linear-gradient(var(--gray-gradient)) no-repeat;color:rgb(var(--gray));text-align:center}.social-links[data-astro-cid-sz7xmlte]{display:flex;justify-content:center;gap:1em;margin-top:1em}.social-links[data-astro-cid-sz7xmlte] a[data-astro-cid-sz7xmlte]{text-decoration:none;color:rgb(var(--gray))}.social-links[data-astro-cid-sz7xmlte] a[data-astro-cid-sz7xmlte]:hover{color:rgb(var(--gray-dark))}\na[data-astro-cid-eimmu3lg]{display:inline-block;text-decoration:none}a[data-astro-cid-eimmu3lg].active{font-weight:bolder;text-decoration:underline}\nmain[data-astro-cid-bvzihdzo]{width:calc(100% - 2em);max-width:100%;margin:0}.hero-image[data-astro-cid-bvzihdzo]{width:100%}.hero-image[data-astro-cid-bvzihdzo] img[data-astro-cid-bvzihdzo]{display:block;margin:0 auto;border-radius:12px;box-shadow:var(--box-shadow)}.prose[data-astro-cid-bvzihdzo]{width:720px;max-width:calc(100% - 2em);margin:auto;padding:1em;color:rgb(var(--gray-dark))}.title[data-astro-cid-bvzihdzo]{margin-bottom:1em;padding:1em 0;text-align:center;line-height:1}.title[data-astro-cid-bvzihdzo] h1[data-astro-cid-bvzihdzo]{margin:0 0 .5em}.date[data-astro-cid-bvzihdzo]{margin-bottom:.5em;color:rgb(var(--gray))}.last-updated-on[data-astro-cid-bvzihdzo]{font-style:italic}\n"}],"routeData":{"route":"/blog/[...slug]","type":"page","pattern":"^\\/blog(?:\\/(.*?))?\\/?$","segments":[[{"content":"blog","dynamic":false,"spread":false}],[{"content":"...slug","dynamic":true,"spread":true}]],"params":["...slug"],"component":"src/pages/blog/[...slug].astro","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"site":"http://localhost:3000","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["/app/src/pages/blog/[...slug].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/blog/[...slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["/app/src/pages/blog/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/blog/index@_@astro",{"propagation":"in-tree","containsHead":false}],["/app/src/pages/rss.xml.js",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/rss.xml@_@js",{"propagation":"in-tree","containsHead":false}],["/app/src/pages/about.astro",{"propagation":"none","containsHead":true}],["/app/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var r=(i,c,s)=>{let n=async()=>{await(await i())()},t=new IntersectionObserver(e=>{for(let o of e)if(o.isIntersecting){t.disconnect(),n();break}});for(let e of s.children)t.observe(e)};(self.Astro||(self.Astro={})).visible=r;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-page:src/pages/rss.xml@_@js":"pages/rss.xml.astro.mjs","\u0000@astro-page:src/pages/about@_@astro":"pages/about.astro.mjs","\u0000@astro-page:src/pages/blog/index@_@astro":"pages/blog.astro.mjs","\u0000@astro-page:src/pages/blog/[...slug]@_@astro":"pages/blog/_---slug_.astro.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000empty-middleware":"_empty-middleware.mjs","/src/pages/about.astro":"chunks/pages/about_9K62qaLn.mjs","/src/pages/rss.xml.js":"chunks/pages/rss_Q8lh_xR2.mjs","\u0000@astrojs-manifest":"manifest_VerlKjCC.mjs","/app/src/content/blog/first-post.md?astroContentCollectionEntry=true":"chunks/first-post_LgPVODzJ.mjs","/app/src/content/blog/markdown-style-guide.md?astroContentCollectionEntry=true":"chunks/markdown-style-guide_hwBinCe5.mjs","/app/src/content/blog/second-post.md?astroContentCollectionEntry=true":"chunks/second-post_pFAspklC.mjs","/app/src/content/blog/third-post.md?astroContentCollectionEntry=true":"chunks/third-post_ecK649LO.mjs","/app/src/content/blog/using-mdx.mdx?astroContentCollectionEntry=true":"chunks/using-mdx_vjGg4Cjy.mjs","/app/src/content/blog/first-post.md?astroPropagatedAssets":"chunks/first-post_GF5bbP19.mjs","/app/src/content/blog/markdown-style-guide.md?astroPropagatedAssets":"chunks/markdown-style-guide_VqlrVwGN.mjs","/app/src/content/blog/second-post.md?astroPropagatedAssets":"chunks/second-post_vubM-Bm7.mjs","/app/src/content/blog/third-post.md?astroPropagatedAssets":"chunks/third-post_qw2ffGeK.mjs","/app/src/content/blog/using-mdx.mdx?astroPropagatedAssets":"chunks/using-mdx_1Gtctcef.mjs","/app/src/content/blog/first-post.md":"chunks/first-post_1oK8k3q1.mjs","/app/src/content/blog/markdown-style-guide.md":"chunks/markdown-style-guide_22RIGCMn.mjs","/app/src/content/blog/second-post.md":"chunks/second-post_JtsnOoXF.mjs","/app/src/content/blog/third-post.md":"chunks/third-post_7ZS4wpkW.mjs","/app/src/content/blog/using-mdx.mdx":"chunks/using-mdx_Fb1fXAn2.mjs","astro:scripts/before-hydration.js":""},"assets":[]});

export { manifest };
