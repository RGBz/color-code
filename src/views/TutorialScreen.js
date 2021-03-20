import React, { Component } from 'react';

import RuleEditor from './RuleEditor';
import PatternEditor from './PatternEditor';
import IconButton from './buttons/IconButton';
import AchievementIcon from './AchievementIcon';
import Sign from './Sign';

import Rulebook from '../models/Rulebook';
import Rule from '../models/Rule';
import Pattern from '../models/Pattern';
import Grid from '../models/Grid';
import { RulebookPropType } from './prop-types';

const STEP_IMAGES = [
  'https://cdn.glitch.com/5bb393f1-e781-4a01-8e4e-4b05e66e3d36%2Fexample-step-0.png?1528586321914',
  'https://cdn.glitch.com/5bb393f1-e781-4a01-8e4e-4b05e66e3d36%2Fexample-step-1.png?1528586323128',
  'https://cdn.glitch.com/5bb393f1-e781-4a01-8e4e-4b05e66e3d36%2Fexample-step-2.png?1528586324737'
];

function logo (size = 15) {
  return (
    <img src="https://cdn.glitch.com/5bb393f1-e781-4a01-8e4e-4b05e66e3d36%2Flogo.png?1527979638257" height={size} />
  );
}

export default class TutorialScreen extends Component {

  render () {
    return (
      <div className="tutorial">
        <IconButton 
          icon="https://cdn.glitch.com/5bb393f1-e781-4a01-8e4e-4b05e66e3d36%2Fback.png?1528248484044" 
          className="back-button" 
          onPress={this.props.onClose} 
        />
        <br/><br/>
        <h2>What’s {logo(30)} ?</h2>
        <p>
          {logo()} is a puzzle game where you have to make one picture look like another by coming up with a set of 
          rules that describe how pixels should change color.
        </p>

        <h3>How to win: Make ‘em match</h3>
        <p>
          Conceptually, winning is easy: make the picture that’s <strong>YOURS</strong>, 
          look the the <strong>GOAL</strong> picture. How you accomplish that is a bit trickier…
        </p>

        <div className="row" style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div>
            <Sign label="YOURS" />
            <img src={STEP_IMAGES[0]} />
          </div>
          &nbsp;
          <img src="https://cdn.glitch.com/5bb393f1-e781-4a01-8e4e-4b05e66e3d36%2Fforward.png?1528586694179" />
          &nbsp;
          <div>
            <Sign label="GOAL" />
            <img src={STEP_IMAGES[2]} />
          </div>
        </div>

        <h3>How to play: Painting rules</h3>
        <p>
          You can only change <strong>your picture</strong> one pixel at a time by creating rules. 
        </p>
        <p>
          Each rule is of the form <q>if you see a pattern that looks like X, change the pixel at the center 
          of it to be the color Y</q>
        </p>
      
        <p>
          Here’s a very simple rule with three 1x1 patterns:
        </p>

        <p>
          <RuleEditor
            style={{ borderBottom: 'none' }}
            palette={['red', 'green', 'blue', 'purple']}
            rule={Rule.fromJSON({ 
              targetValue: 3, 
              patterns: [
                new Pattern(new Grid({ width: 1, height: 1, fillValue: 0 })),
                new Pattern(new Grid({ width: 1, height: 1, fillValue: 1 })),
                new Pattern(new Grid({ width: 1, height: 1, fillValue: 2 })),
              ] 
            })}
            disabled={true}
          />
        </p>

        <p>
          This rule says <q>if a pixel is <span style={{color:'red'}}>red</span>, <span style={{color:'green'}}>green</span> or <span style={{color:'blue'}}>blue</span>, 
          then change it to be <span style={{color:'purple'}}>purple</span>.</q>
        </p>

        <p>
          And here’s a more complicated rule with 3x3 patterns:
        </p>

        <p>
          <RuleEditor
            style={{ borderBottom: 'none' }}
            palette={['orange', 'green', 'pink']}
            rule={Rule.fromJSON({ 
              targetValue: 2, 
              patterns: [
                new Pattern(new Grid({ width: 3, height: 3, cells: [-1, 0, -1, -1, -1, -1, -1, 0, -1] })),
                new Pattern(new Grid({ width: 3, height: 3, cells: [-1, -1, -1, 1, -1, 1, -1, -1, -1] })),
              ] 
            })}
            disabled={true}
          />
        </p>

        <p>
          This rule says <q>if a pixel has an <span style={{color:'orange'}}>orange</span> pixel above it AND below it 
          OR if a pixel has a <span style={{color:'green'}}>green</span> pixel to the left AND right of it,
          then change it to be <span style={{color:'pink'}}>pink</span>.</q>
        </p>

        <p>
          Notice the empty, <span style={{color:'#ccc'}}>light-gray</span> colored cells in the patterns. If a cell is left empty, 
          that means it's a <strong>wild card</strong> and it will match any pixel.
        </p>

        <h3>Rule Execution & Steps</h3>
        <p>
          Every time you update your rules, {logo()} executes them and redraws your picture over and over like an 
          animation. Each drawing is called a <strong>step</strong>. 
          Step 0 is always the starting picture for the puzzle. 
          The steps after that are based on executing the rules you created.
        </p>

        <p>
          Whenever your rules change, here’s what happens: 
        </p>

        <h4>Step 0:</h4>
        <p>
          {logo()} resets your picture to be what the puzzle specified as the starting picture. 
        </p>

        <div className="row" style={{ alignItems: 'center', justifyContent: 'center' }}>
          <img src={STEP_IMAGES[0]} />
        </div>

        <h4>Step 1:</h4>
        <p>
          {logo()} goes through every pixel in the starting picture and checks to see if any of your rules apply. 
          As soon as it finds a rule that applies for the pixel, it changes the pixel’s color to be what the rule 
          specified and then moves on to the next pixel. 
        </p>

        <div className="row" style={{ alignItems: 'center', justifyContent: 'center' }}>
          <img src={STEP_IMAGES[0]} />
          <div style={{ margin: 40, fontSize: 32 }}>+</div>
          <div>
            <RuleEditor
              patternSize={5}
              style={{ borderBottom: 'none' }}
              palette={['#8B572A', '#FFB500', 'black', 'white', '#1190EE', '#9012FE']}
              rule={Rule.fromJSON({ 
                targetValue: 4, 
                patterns: [
                  new Pattern(new Grid({ width: 3, height: 3, cells: [1, 5, 5, 1, 2, 2, 1, 0, 0] })),
                  new Pattern(new Grid({ width: 3, height: 3, cells: [0, 5, 5, 0, 2, 2, 0, 0, 0] })),
                ] 
              })}
              disabled={true}
            />
            <RuleEditor
              patternSize={5}
              style={{ borderBottom: 'none' }}
              palette={['#8B572A', '#FFB500', 'black', 'white', '#1190EE', '#9012FE']}
              rule={Rule.fromJSON({ 
                targetValue: 3, 
                patterns: [
                  new Pattern(new Grid({ width: 3, height: 3, cells: [-1, -1, -1, -1, 5, -1, -1, -1, -1] })),
                  new Pattern(new Grid({ width: 3, height: 3, cells: [-1, 2, -1, -1, 3, -1, -1, -1, -1] })),
                ] 
              })}
              disabled={true}
            />
          </div>
          <div style={{ margin: 40, fontSize: 32 }}>=</div>
          <img src={STEP_IMAGES[1]} />
        </div>

        <p>
          Once every pixel has been processed, {logo()} will check to see if you’ve won. 
          If you did, congrats! Your rules solved the puzzle in only 1 step! 
          If you haven’t won, though, we keep going… 
        </p>

        <h4>Steps 2 and beyond…</h4>
        <p>
          Each step builds on the picture from the last step.           
        </p>

        <div className="row" style={{ alignItems: 'center', justifyContent: 'center' }}>
          <img src={STEP_IMAGES[0]} />
          &nbsp;
          <img src="https://cdn.glitch.com/5bb393f1-e781-4a01-8e4e-4b05e66e3d36%2Fforward.png?1528586694179" />
          &nbsp;
          <img src={STEP_IMAGES[1]} />
          &nbsp;
          <img src="https://cdn.glitch.com/5bb393f1-e781-4a01-8e4e-4b05e66e3d36%2Fforward.png?1528586694179" />
          &nbsp;
          <img src={STEP_IMAGES[2]} />
        </div>

        <p>
          {logo()} takes the picture result of the previous step and 
          processes all the pixels in this new image. It does this over and over again following the same set of rules, 
          until any of the following occur:
        </p>
        <ol>
          <li>You win</li>
          <li>You run out of allowed steps</li>
          <li>Two consecutive steps have the same exact resulting picture</li>
        </ol>

        <p>
          If any of the above occur, the looping stops and you’ll see the last version of your picture.
        </p>

        <h3>High Scores & Secondary Goals</h3>
        <p>
          Just like golf, low scores are better. For each puzzle there’s actually 3 goals:
        </p>
        
        <div className="rule" style={{ alignItems: 'center', justifyContent: 'center', borderBottom: 'none' }}>
          <AchievementIcon type="completed" styling="stroke" />
          <AchievementIcon type="steps" styling="stroke" />
          <AchievementIcon type="patterns" styling="stroke" />
        </div>
      
        <div className="column" style={{ alignItems: 'center' }}>
          <p className="row" style={{ alignItems: 'center' }}>
            <AchievementIcon type="completed" styling="solid" style={{ marginRight: 40 }} /> 
            Just match the pictures (main goal)
          </p>
          <p className="row" style={{ alignItems: 'center' }}>
            <AchievementIcon type="steps" styling="solid" style={{ marginRight: 40 }} /> 
            Do it in as few steps as possible
          </p>
          <p className="row" style={{ alignItems: 'center' }}>
            <AchievementIcon type="patterns" styling="solid" style={{ marginRight: 40 }} /> 
            Do it with as few patterns as possible
          </p>
        </div>

        <p>
          To move on to the next puzzle in the game you need only need to complete the main matching goal of the one before it, 
          but if you’re feeling ambitious you can shoot for getting the fewest possible steps or patterns.
        </p>

        <p>
          For some puzzles you can get perfect scores for the fewest steps and the fewest patterns at the same time. 
          Other puzzles may require two different solutions: one that minimizes the steps and another that 
          minimizes the patterns. You only need to complete each goal once to have the record saved.
        </p>

        <h3>That’s it!</h3>
        <p>
          Have fun and good luck!
        </p>

        <br/><br/>
        <IconButton 
          icon="https://cdn.glitch.com/5bb393f1-e781-4a01-8e4e-4b05e66e3d36%2Fback.png?1528248484044" 
          className="back-button" 
          onPress={this.props.onClose} 
        />
        
      </div>
    );
  }
}