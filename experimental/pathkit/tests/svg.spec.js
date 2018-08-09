
describe('PathKit\'s SVG Behavior', function() {
    // Note, don't try to print the PathKit object - it can cause Karma/Jasmine to lock up.
    var PathKit = null;
    const LoadPathKit = new Promise(function(resolve, reject){
        if (PathKit) {
            resolve();
        } else {
            PathKitInit({
                locateFile: (file) => '/base/npm-wasm/bin/test/'+file,
            }).then((_PathKit) => {
                PathKit = _PathKit;
                resolve();
            });
        }
    });

    it('can create a path from an SVG string', function(done){
        LoadPathKit.then(() => {
            //.This is a parallelagram from
            // https://upload.wikimedia.org/wikipedia/commons/e/e7/Simple_parallelogram.svg
            let path = PathKit.FromSVGString('M 205,5 L 795,5 L 595,295 L 5,295 L 205,5 z');

            let cmds = path.toCmds();
            expect(cmds).toBeTruthy();
            // 1 move, 4 lines, 1 close
            // each element in cmds is an array, with index 0 being the verb, and the rest being args
            expect(cmds.length).toBe(6);
            expect(cmds).toEqual([[PathKit.MOVE_VERB, 205, 5],
                                  [PathKit.LINE_VERB, 795, 5],
                                  [PathKit.LINE_VERB, 595, 295],
                                  [PathKit.LINE_VERB, 5, 295],
                                  [PathKit.LINE_VERB, 205, 5],
                                  [PathKit.CLOSE_VERB]]);
            path.delete();
            done();
        });
    });

    it('can create an SVG string from a path', function(done){
        LoadPathKit.then(() => {
            //.This is a parallelagram from
            // https://upload.wikimedia.org/wikipedia/commons/e/e7/Simple_parallelogram.svg
            let path = PathKit.NewPath();
            path.moveTo(205, 5);
            path.lineTo(795, 5);
            path.lineTo(595, 295);
            path.lineTo(5, 295);
            path.lineTo(205, 5);
            path.closePath();

            let svgStr = path.toSVGString();
            // We output it in terse form, which is different than Wikipedia's version
            expect(svgStr).toEqual('M205 5L795 5L595 295L5 295L205 5Z');
            path.delete();
            done();
        });
    });

    it('should have input and the output be the same', function(done){
        LoadPathKit.then(() => {
            let testCases = [
                'M0 0L1075 0L1075 242L0 242L0 0Z'
            ];

            for(let svg of testCases) {
                let path = PathKit.FromSVGString(svg);
                let output = path.toSVGString();

                expect(svg).toEqual(output);

                path.delete();
            }
            done();
        });
    });

});