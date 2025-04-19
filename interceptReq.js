(() => {
    "use strict";
    const e = "fetch" in window, t = "Request" in window;
    window;
    const s = new class {
        constructor() {
            this.rules = [], this.RULE = "REQRES_MODDER", this.replaceXMLHttpRequest(), this.patchXMLHttpRequest(), this.patchFetch()
        }

        loadRules(e) {
            this.rules = e, window[this.RULE] = e
        }

        getMatchedRules(e, t) {
            return window[this.RULE] ? window[this.RULE].filter((s => {
                const o = new RegExp(s.conditions.url_pattern).test(e), r = s.conditions.method === t;
                return o && r && s.enabled
            })) : []
        }

        replaceXMLHttpRequest() {
            const e = this;

            class t extends XMLHttpRequest {
                constructor() {
                    return super(), new Proxy(this, {
                        get(t, s) {
                            var o, r, n, i, d, a, c, l;
                            if ("string" == typeof s && !["status", "responseText", "response", "getResponseHeader", "getAllResponseHeaders"].includes(s)) {
                                const e = t[s];
                                return "function" == typeof e ? e.bind(t) : e
                            }
                            const u = (p = t.responseURL, f = t.openArgs[0], e.rules.filter((e => {
                                const t = new RegExp(e.conditions.url_pattern).test(p), s = e.conditions.method === f;
                                return t && s && e.enabled
                            })));


                            // -------------------------------------
                            // edit flag to be true first
                            // example for custom logic, edit the response body value
                            // responseText will return text, response will return a JSON object or text
                            // -------------------------------------

                            // if ("responseText" === s || ("response" === s && typeof t.response == 'string')) {
                            //     let newResp = JSON.parse(t.responseText);
                            //     if (newResp.website) {
                            //         newResp.website = "test.com";
                            //         return JSON.stringify(newResp);
                            //     }
                            // }
                            // if ("response" === s && typeof t.response == 'object') {
                            //     if (t.response.website) {
                            //         t.response.website = "test.com"
                            //         return t.response;
                            //     }
                            // }

                            // -------------------------------------


                            var p, f;
                            if (0 === u.length) {
                                const e = t[s];
                                return "function" == typeof e ? e.bind(t) : e
                            }
                            if ("status" === s) {
                                for (const e of u) if (void 0 !== e.actions.modify_response.status_code && 0 !== e.actions.modify_response.status_code) return e.actions.modify_response.status_code;
                                return t.status
                            }

                            if (("responseText" === s || "response" === s) && 4 === t.readyState) {

                                if ("responseText" === s && ("" === t.responseType || "text" === t.responseType) || "response" === s && "string" == typeof t.response) {
                                    for (const e of u) {
                                        const s = null === (r = null === (o = e.actions.modify_response.body) || void 0 === o ? void 0 : o.replace) || void 0 === r ? void 0 : r.old,
                                            d = null === (i = null === (n = e.actions.modify_response.body) || void 0 === n ? void 0 : n.replace) || void 0 === i ? void 0 : i.new;
                                        if ("*" == s || "" == s) return d;
                                        if (void 0 !== s && void 0 !== d) return t.responseText.replace(s, d)
                                    }
                                    return t.responseText
                                }
                                if ("response" === s && ("json" === t.responseType || "" === t.responseType) && "object" == typeof t.response) {
                                    for (const e of u) {
                                        const s = null === (a = null === (d = e.actions.modify_response.body) || void 0 === d ? void 0 : d.replace) || void 0 === a ? void 0 : a.old,
                                            o = null === (l = null === (c = e.actions.modify_response.body) || void 0 === c ? void 0 : c.replace) || void 0 === l ? void 0 : l.new;
                                        if ("string" == typeof s && "string" == typeof o) {
                                            const e = JSON.stringify(t.response).replace(s, o);
                                            try {
                                                return JSON.parse(e)
                                            } catch (e) {
                                                return t.response
                                            }
                                        }
                                    }
                                    return t.response
                                }
                            }
                            if ("getResponseHeader" === s) return e => {
                                var s, o;
                                const r = t.getResponseHeader(e);
                                for (const t of u) {
                                    const r = null === (s = t.actions.modify_response.headers) || void 0 === s ? void 0 : s.add,
                                        n = null === (o = t.actions.modify_response.headers) || void 0 === o ? void 0 : o.add;
                                    if (r && r[e.toLowerCase()]) return r[e.toLowerCase()];
                                    if (n && n[e.toLowerCase()]) return
                                }
                                return r
                            };
                            if ("getAllResponseHeaders" === s) return () => {
                                var e, s;
                                let o = t.getAllResponseHeaders();
                                const r = new Map;
                                o.split(/\r?\n/).forEach((e => {
                                    if (e.trim()) {
                                        const [t, ...s] = e.split(":");
                                        r.set(t.toLowerCase(), `${t}: ${s.join(":").trim()}`)
                                    }
                                }));
                                for (const t of u) {
                                    const o = null === (e = t.actions.modify_response.headers) || void 0 === e ? void 0 : e.add,
                                        n = null === (s = t.actions.modify_response.headers) || void 0 === s ? void 0 : s.remove;
                                    if (o) for (const [e, t] of Object.entries(o)) {
                                        const s = `${e}: ${t}`;
                                        r.set(e.toLowerCase(), s)
                                    }
                                    if (n) for (const e of n) r.delete(e.toLowerCase())
                                }
                                return Array.from(r.values()).join("\r\n") + "\r\n"
                            };
                            const h = t[s];
                            return "function" == typeof h ? h.bind(t) : h
                        }, set: (e, t, s) => (e[t] = s, !0)
                    })
                }
            }

            window.XMLHttpRequest = t
        }

        patchXMLHttpRequest() {
            const e = this, t = XMLHttpRequest.prototype.open, s = XMLHttpRequest.prototype.send,
                o = XMLHttpRequest.prototype.setRequestHeader;
            XMLHttpRequest.prototype.open = function () {
                this.openArgs = Array.from(arguments), t.apply(this, arguments)
            }, XMLHttpRequest.prototype.setRequestHeader = function () {
                void 0 === this.headerArgs && (this.headerArgs = {}), 2 === arguments.length && (this.headerArgs[arguments[0]] = arguments[1]), o.apply(this, arguments)
            }, XMLHttpRequest.prototype.send = function () {
                const {openArgs: r} = this, n = Array.from(arguments), i = r[0] || "GET";
                this.sendArgs = Array.from(arguments);
                const d = e.getMatchedRules(r[1], i);
                if (d.forEach((e => {
                    const t = e.actions.modify_request.query_params;
                    if (!t) return;
                    const s = new URL(r[1], window.location.href);
                    t.add && Object.entries(t.add).forEach((([e, t]) => {
                        s.searchParams.set(e, t)
                    })), t.remove && t.remove.forEach((e => {
                        s.searchParams.delete(e)
                    })), r[1] = s.toString()
                })), d.forEach((e => {
                    var t, s;
                    r[1] = r[1].replace(null === (t = e.actions.modify_request.url_replacement) || void 0 === t ? void 0 : t.old, null === (s = e.actions.modify_request.url_replacement) || void 0 === s ? void 0 : s.new)
                })), d.forEach((e => {
                    var t, s;
                    const o = null === (s = null === (t = e.actions.modify_request.body) || void 0 === t ? void 0 : t.replace) || void 0 === s ? void 0 : s.new;
                    void 0 !== o && (n[0] = o)
                })), r.length >= 3 && !r[2]) return void 0 !== this.headerArgs && Object.entries(this.headerArgs).forEach((([e, t]) => {
                    o.call(this, e, t)
                })), s.apply(this, n);
                t.apply(this, this.openArgs);
                const a = new Set;
                return d.forEach((e => {
                    var t;
                    const s = null === (t = e.actions.modify_request.headers) || void 0 === t ? void 0 : t.remove;
                    null == s || s.forEach((e => {
                        a.add(e.toLowerCase())
                    }))
                })), void 0 !== this.headerArgs && Object.entries(this.headerArgs).forEach((([e, t]) => {
                    a.has(e.toLowerCase()) || o.call(this, e, t)
                })), d.forEach((e => {
                    var t, s;
                    const r = null === (t = e.actions.modify_request.headers) || void 0 === t ? void 0 : t.add;
                    if (null != r) for (const e in r) a.has(e.toLowerCase()) || o.call(this, e, r[e]);
                    const n = null === (s = e.actions.modify_request.headers) || void 0 === s ? void 0 : s.remove;
                    null == n || n.forEach((e => {
                    }))
                })), s.apply(this, n)
            }, window.XMLHttpRequest = XMLHttpRequest
        }

        patchFetch() {
            if (!e) return;
            const s = this, o = window.fetch;
            window.fetch = async function (e, r) {
                let n, i, d = new Headers;
                t && e instanceof Request ? (n = e.url, i = e.method, d = e.headers instanceof Headers ? e.headers : new Headers(e.headers)) : (n = e, i = r && r.method ? r.method : "GET", d = (null == r ? void 0 : r.headers) instanceof Headers ? r.headers : new Headers(null == r ? void 0 : r.headers));
                const a = s.getMatchedRules(n, i);

                // -------------------------------------
                // example for custom logic, edit the response body value
                // -------------------------------------

                // const requestUrl = e.url;
                // if (requestUrl === 'https://jsonplaceholder.typicode.com/users/1') {
                //     const oldResp = await o(e, r);
                //     const clonedResponse = oldResp.clone();
                //     const oldRespText = await clonedResponse.text();
                //     let modifiedBody = oldRespText;
                //     try {
                //         const respObject = JSON.parse(oldRespText);
                //         if (respObject.website) {
                //             respObject.website = "test.com";
                //         }
                //         modifiedBody = JSON.stringify(respObject);
                //     } catch (err) {
                //         // parse JSON error
                //     }
                //     const newResp = new Response(modifiedBody, {
                //         status: clonedResponse.status,
                //         statusText: clonedResponse.statusText,
                //         headers: clonedResponse.headers
                //     });
                //
                //     return newResp;
                // }

                // -------------------------------------


                if (0 === a.length) return o(e, r);
                let c = new URL(n, window.location.href);

                return a.forEach((e => {
                    var t, s, o;
                    const n = e.actions.modify_request.url_replacement;
                    (null == n ? void 0 : n.old) && (c = new URL(c.href.replace(n.old, n.new)));
                    const i = e.actions.modify_request.query_params;
                    i && (i.add && Object.entries(i.add).forEach((([e, t]) => {
                        c.searchParams.set(e, t)
                    })), i.remove && i.remove.forEach((e => {
                        c.searchParams.delete(e)
                    })));
                    const a = null === (t = e.actions.modify_request.body) || void 0 === t ? void 0 : t.replace;
                    (null == a ? void 0 : a.new) && r && r.body && "string" == typeof r.body && (r.body = a.new);
                    const l = null === (s = e.actions.modify_request.headers) || void 0 === s ? void 0 : s.add;
                    l && Object.entries(l).forEach((([e, t]) => {
                        d.set(e, t)
                    }));
                    const u = null === (o = e.actions.modify_request.headers) || void 0 === o ? void 0 : o.remove;
                    u && u.forEach((e => {
                        d.delete(e)
                    }))
                })), "string" == typeof e ? e = c.toString() : e instanceof Request && (e = new Request(c.toString(), e)), r && (r.headers = d, r.method = i), o.apply(window, [e, r]).then((e => {
                    const t = e.clone();
                    if ("opaque" === e.type) return t;
                    let s = t.status >= 200 && t.status <= 599 ? t.status : 502;
                    a.forEach((e => {
                        const t = e.actions.modify_response.status_code;
                        t && (s = t)
                    }));
                    const o = t.statusText || "Network Error", r = new Headers(t.headers);

                    return a.forEach((e => {
                        const t = e.actions.modify_response.simulate_error;
                        if (null == t ? void 0 : t.enabled) return Promise.reject({
                            status: t.error_code || 500,
                            message: t.error_message || "Simulated error"
                        })
                    })), t.text().then((e => {
                        let n = new Response(e, {status: s, statusText: o, headers: r});
                        return a.forEach((i => {
                            var d, a, c;

                            const l = null === (d = i.actions.modify_response.body) || void 0 === d ? void 0 : d.replace;
                            if (null == l ? void 0 : l.new) if ("*" != (null == l ? void 0 : l.old) && "" != (null == l ? void 0 : l.old) || !l.new) {
                                const t = e.replace(l.old, l.new);
                                n = new Response(t, {status: s, statusText: o, headers: r})
                            } else n = new Response(l.new, {status: s, statusText: o, headers: r});
                            const u = null === (a = i.actions.modify_response.headers) || void 0 === a ? void 0 : a.add,
                                p = null === (c = i.actions.modify_response.headers) || void 0 === c ? void 0 : c.remove;
                            if (u || p) {
                                const e = new Headers(t.headers);
                                u && Object.entries(u).forEach((([t, s]) => {
                                    e.set(t, s)
                                })), p && p.forEach((t => {
                                    e.delete(t)
                                })), n = new Response(n.body, {status: s, statusText: o, headers: e})
                            }
                        })), 0 == a.length && (n = new Response(e, {status: s, statusText: o, headers: r})), n
                    }))
                }))
            }
        }
    };
    window.requestHookSDK = s, window.addEventListener("message", (e => {
        if (e.origin === location.origin && "REQRES_MODDER_RULES_INIT" === e.data.type) {
            const t = e.data.rules;
            window.requestHookSDK.loadRules(t)
        }
    }))
})();