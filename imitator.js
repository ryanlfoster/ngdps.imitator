/* global adobeDPS */
/* jslint bitwise: true */

if (typeof adobeDPS === 'undefined') {
  throw new Error('AdobeLibraryAPI.js must be installed. Download from www.adobe.com/go/dps-library-store-api');
}

/**
 * Extends an existing adobeDPS object, when the function imitate(delay) is called
 * @type {Object}
 */
adobeDPS.ngdpsImitator = {
  imitate: function (delay) {
    'use strict';

    var _randomizeGuid = function (c) {
      var r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    };


    var _functionMissing = function () {
      console.log('Method is not yet implemented into ngdps.imitator. Feel free to contribute. https://github.com/richardbrammer/ngdps.imitator');
    };


    var getPreviewImage = function (width, height, isPortrait) {
      var imageUrl = 'http://i.imgur.com/kH14hwE.png',
        transaction;
      width = null; // width and height are ignored by adobeDPS
      height = null;

      if (isPortrait === true) {
        imageUrl = 'http://i.imgur.com/lcy0ia3.png';
      }

      window.setTimeout((function (that, url) {
        that.previewImageURL = url;
      })(this, imageUrl), 1000);

      transaction = {
        completedSignal: {
          add: function (callback) {
            window.setTimeout((function (url, fn) {
              var transaction = {
                state: 400, // no error
                previewImageURL: url
              };
              fn(transaction);
            })(imageUrl, callback), 1000);
          },
          addOnce: function (callback) {
            window.setTimeout((function (url, fn) {
              var transaction = {
                state: 400, // no error
                previewImageURL: url
              };
              fn(transaction);
            })(imageUrl, callback), 1000);
          }
        }
      };

      return transaction;

    };


    var verifyContentPreviewSupported = function () {
      var transaction;

      // http://www.adobe.com/devnet-docs/digitalpublishingsuite/DPSViewerSDK-2.32/docs/library/symbols/adobeDPS-FolioContentPreviewState.html
      this.contentPreviewState = 1;

      window.setTimeout((function (that) {
        that.contentPreviewState = 3;
        that.supportsContentPreview = true;
      })(this), 500);

      transaction = {
        completedSignal: {
          add: function (callback) {
            window.setTimeout((function (fn) {
              var transaction = {
                state: 400 // no error
              };
              fn(transaction);
            })(callback), 1000);
          },
          addOnce: this.add
        }
      };

      return transaction;
    };


    var canDownloadContentPreview = function () {
      return true;
    };

    var signal = {
      active: true,
      memorize: true,
      _bindings: [],
      add: function (callback) {
        var transaction = {
          progress: 0
        };
        this._bindings.push(callback);
        if (this.parentFolio) {
          window.setInterval((function (fn, transaction, folio) {
            return function () {
              transaction.progress += 7;
              if (transaction.progress > 10) {
                folio.isViewable = true;
              }
              if (transaction.progress > 100) {
                folio.state = 1000;
                transaction.progress = 100;
              }
              folio.updatedSignal.dispatch();
              fn(transaction);
            };
          })(callback, transaction, this.parentFolio), 50000 * Math.random());
        }
      },
      addOnce: function (callback) {
        window.setTimeout((function (fn) {
          fn();
        })(callback), 50000 * Math.random());
      },
      remove: _functionMissing,
      removeAll: _functionMissing,
      getNumListeners: _functionMissing,
      halt: _functionMissing,
      has: function (callback) {
        if (this._bindings.indexOf(callback) !== -1) {
          return true;
        } else {
          return false;
        }
      },
      dispatch: function () {},
      forget: _functionMissing,
      dispose: _functionMissing
    };

    var downloadHandler = function () {
      signal.parentFolio = this;
      this.state = 1000;

      return {
        progressSignal: signal,
        updatedSignal: signal,
        completedSignal: { dispatch: function () {}} // TODO signal is missing
      };

    };



    adobeDPS.ngdpsImitator.state = true;
    adobeDPS.ngdpsImitator.info = 'This adobeDPS object is extended by ngdps.imitator; This info should never appear in a production environment. More information: https://github.com/richardbrammer/ngdps.imitator';



    /*******************************
     * SET FAKE configrationService
     *******************************/
    adobeDPS.configurationService.applicationID = 'com.geildanke.ngdps';
    adobeDPS.configurationService.applicationVersion = '0.1.0';
    adobeDPS.configurationService.adobeApplicationVersion = null;


    /*********************
     * APPEND FAKE FOLIOS
     *********************/
    if (typeof delay !== 'number') {
      delay = parseInt(delay, 10) || 100;
    }

    window.setTimeout(function () {
      var guid;
      console.log('NGDPS.imitation initialized (after ' + delay + ' ms). Please help to improve by contributing at https://github.com/richardbrammer/ngdps.imitator');
      adobeDPS.initializationComplete.dispatch();

      for (var i = 0; i < 50; i += 1) {
        guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, _randomizeGuid);
        adobeDPS.libraryService.folioMap.internal[guid] = {
          id: guid,
          
          // primitives
          broker: 'appleStore',
          description: 'Description field.',
          downloadSize: Math.random() * 100000000,
          filter: '',
          folioDescription: 'Folio description field for #' + i + ' folio.',
          folioNumber: 'Imitated Folio ' + i,
          previewImageURL: null,
          price: '$ 2.99',
          productId: 'com.geildanke.ngdps.imitator.' + i,
          receipt: null,
          targetDimensions: '1024x768',
          title: 'Imitator Title ' + i,

          // booleans
          hasSections: false,
          isArchivable: false,
          isCompatible: false,
          isDownloadable: false,
          isPurchasable: true,
          isThirdPartyEntitled: false,
          isUpdatable: false,
          isViewable: false,
          supportsContentPreview: false,

          // objects
          sections: {
            addedSignal: {
              add: _functionMissing,
              addOnce: _functionMissing
            },
            internal: {},
            removedSignal: {
              add: _functionMissing,
              addOnce: _functionMissing
            }
          },
          updatedSignal: signal,

          // arrays
          currentTransactions: [],

          // date
          publicationDate: new Date(1414099620000 - (Math.random() * 10000000000)),
          
          // methods
          archive: _functionMissing,
          canDownloadContentPreview: canDownloadContentPreview,
          currentStateChangingTransaction: _functionMissing,
          download: downloadHandler,
          downloadContentPreview: _functionMissing,
          getPreviewImage: getPreviewImage,
          getSections: _functionMissing,
          isFree: _functionMissing,
          purchase: _functionMissing,
          update: _functionMissing,
          verifyContentPreviewSupported: verifyContentPreviewSupported,
          view: _functionMissing,
          
          // states
          contentPreviewState: 0,
          state: 200
        };
        adobeDPS.libraryService.folioMap.addedSignal.dispatch();
      }
    }, delay);
  }
};

/* load with query parameter imitate string */
(function (adobeDPS) {
  'use strict';

  var urlParams;

  (function (adobeDPS) {
    var match,
      pl = /\+/g, // Regex for replacing addition symbol with a space
      search = /([^&=]+)=?([^&]*)/g,
      decode = function (s) {
        return decodeURIComponent(s.replace(pl, ' '));
      },
      query = window.location.search.substring(1);

    urlParams = {};
    while ((match = search.exec(query)) !== null) {
      urlParams[decode(match[1])] = decode(match[2]);
    }

    if (typeof urlParams.imitate !== 'undefined') {
      adobeDPS.ngdpsImitator.imitate(urlParams.imitate);
    }

  })(adobeDPS);

})(adobeDPS);