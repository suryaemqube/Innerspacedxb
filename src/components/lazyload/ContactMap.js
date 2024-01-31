import React from "react";

export default function Map({ pageAcf }) {
    return (
        pageAcf && pageAcf.mapHtml && (
            <section className="innerspace-google-map" id="visit-showroom">
                <span dangerouslySetInnerHTML={{ __html: pageAcf.mapHtml }} />
            </section>
        )
    );
}
