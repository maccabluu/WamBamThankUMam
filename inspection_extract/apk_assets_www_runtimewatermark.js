        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }

          5% {
            transform: rotate(-10deg);
            animation-timing-function: ease-out;
          }

          17% {
            transform: rotate(370deg);
            animation-timing-function: ease-in-out;
          }

          20% {
            transform: rotate(360deg);
            animation-timing-function: ease-in-out;
          }

          100% {
            transform: rotate(360deg);
          }
        }

        #watermark-background {
          position: absolute;
          pointer-events: none;
          width: 100%;
          transition-property: opacity;
          transition-duration: ${this._fadeDuration}s;
        }

        #watermark-link {
          all: unset;
          position: absolute;
          cursor: pointer;
          pointer-events: none;
          user-select: none;

          /* For Safari */
          -webkit-user-select: none;
        }

        #watermark {
          display: flex;
          flex-direction: row;
          align-items: center;
          transition-property: opacity;
          transition-duration: ${this._fadeDuration}s;
          transition-timing-function: ease-out;
        }

        #watermark > div {
          display: flex;
          flex-direction: column;
          margin-left: 5px;
        }

        #watermark span {
          color: white;
          font-family: 'Tahoma', 'Gill sans', 'Helvetica', 'Arial';
          font-size: ${this._textFontSize}px;
          transition: opacity;
          transition-duration: ${this._fadeDuration}s;

          /* For Safari */
          -webkit-transition: opacity;
          -webkit-transition-duration: ${this._fadeDuration}s;
        }

        #watermark svg.spinning {
          animation-name: spin;
          animation-direction: normal;
          animation-duration: 5s;
          animation-iteration-count: 3;
          animation-delay: 1.5s;
        }

        #watermark svg path {
          fill: white;
        }

        @media (hover: hover) {
          #watermark span {
            text-decoration: underline;
            text-decoration-style: solid;
            text-decoration-color: transparent;
          }

          #watermark:hover span {
            text-decoration-color: white;

            /* For Safari */
            -webkit-text-decoration-color: white;
          }
        }
        `,document.head.appendChild(e)}}r.RuntimeWatermark=s})(a=n.watermark||(n.watermark={}))})(gdjs||(gdjs={}));
//# sourceMappingURL=runtimewatermark.js.map
