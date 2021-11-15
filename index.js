 "use strict";
 let yourhand = new Map();

 let tophand = new Map();

 let righthand = new Map();

 let lefthand = new Map();

 let heart = new Map(); //心
 let spade = new Map(); //桃Q-13
 let diamond = new Map(); //方
 let club = new Map(); //花
 let round = 1;
 let nowshape = "club"; // club 2 start
 let board = new Map();
 let canplayheart = false;

 let cardplayed = new Map();
 let yourscore = 0;
 let leftscore = 0;
 let topscore = 0;
 let rightscore = 0;

 let order = ["your", "left", "top", "right"];
 var BreakException = {};



 function resetboard() {
   order = ["your", "left", "top", "right"];
   yourhand.clear();
   lefthand.clear();
   righthand.clear();
   tophand.clear();
   heart.clear();
   spade.clear();
   diamond.clear();
   club.clear();
   for (let i = 1; i <= 52; i++) {
     if (i <= 13) heart.set(i, "heart");
     if (i > 13 && i <= 26) spade.set(i, "spade");
     if (i > 26 && i <= 39) diamond.set(i, "diamond");
     if (i > 39 && i <= 52) club.set(i, "club");

   }
   round = 1;
   nowshape = "club";
   board.clear();
   canplayheart = false;
   cardplayed.clear();
   yourscore = 0;
   leftscore = 0;
   topscore = 0;
   rightscore = 0;
 }

 function shuffle() {
   let stop = true;
   let max = 52;
   let count = 52;
   do {
     let num = Math.floor(Math.random() * max) + 1;

     if (hascard(num)) {

       if (yourhand.size < 13) {
         addcard(yourhand, num, shape(num));
         remove_unshufflecard(num);

       } else if (lefthand.size < 13) {
         addcard(lefthand, num, shape(num));
         remove_unshufflecard(num);

       } else if (tophand.size < 13) {
         addcard(tophand, num, shape(num));
         remove_unshufflecard(num);

       } else if (righthand.size < 13) {
         addcard(righthand, num, shape(num));
         remove_unshufflecard(num);
       }
       count--;

     }
     if (count == 0) stop = false;
   } while (stop)
   sort();
 }

 function whofirst() {
   if (yourhand.has(41)) {
     order = ["your", "left", "top", "right"];
   }
   if (lefthand.has(41)) {
     order = ["left", "top", "right", "your"];
   }
   if (tophand.has(41)) {
     order = ["top", "right", "your", "left"];
   }
   if (righthand.has(41)) {
     order = ["right", "your", "left", "top"];
   }

 }

 function hascard(i) {
   if (i <= 13) return heart.has(i);
   if (i > 13 && i <= 26) return spade.has(i);
   if (i > 26 && i <= 39) return diamond.has(i);
   if (i > 39 && i <= 52) return club.has(i);
   return false;

 }

 function remove_unshufflecard(i) {
   if (i <= 13) removecard(heart, i);
   if (i > 13 && i <= 26) removecard(spade, i);
   if (i > 26 && i <= 39) removecard(diamond, i);
   if (i > 39 && i <= 52) removecard(club, i);

 }



 function removecard(hand, key) {

   if (!hand instanceof Map) throw new Error("error hand");
   hand.delete(key);



 }

 function addcard(hand, key, shape) {
   if (!hand instanceof Map) throw new Error("error hand");
   hand.set(key, shape);



 }

 function hasheart() {
   board.forEach(function(value, key) {
     if (value == "heart") return true;
   });


   return false;

 }

 function shape(i) {
   if (i <= 13) return "heart";
   if (i > 13 && i <= 26) return "spade";
   if (i > 26 && i <= 39) return "diamond";
   if (i > 39 && i <= 52) return "club";

 }

 function sort() {
   yourhand = sortMapByKEY(yourhand);
   lefthand = sortMapByKEY(lefthand);
   righthand = sortMapByKEY(righthand);
   tophand = sortMapByKEY(tophand);



 }

 function sortMapByKEY(map) {
   return new Map(
     Array
     .from(map)
     .sort((a, b) => {
       // a[0], b[0] is the key of the map
       return a[0] - b[0];
     })
   );
 }

 function display(map) {
   map.forEach(function(value, key) {
     console.log(key + ' = ' + value);
   });

 }

 function hasplayed() {
   if (board.size != 4) throw new Error("board wrong size");

   board.forEach(function(value, key) {

     passcard(key, board, cardplayed);
   });
   board.clear();

 }

 function passcard(num, fromhand, tohand) {

   if (fromhand.has(num)) {
     removecard(fromhand, num);
     addcard(tohand, num, shape(num));
   } else {
     throw new Error(num + " not a card");
   }

 }

 function count_shape(hand, shape) {
   let count = 0;
   hand.forEach(function(value, key) {
     if (value == shape) count++;
   });
   return count;

 }

 function islowsuit(key) {
   if (key >= 2 && key <= 5) return true;
   if (key >= 15 && key <= 18) return true;
   if (key >= 28 && key <= 31) return true;
   if (key >= 41 && key <= 44) return true;
   return false;


 }

 function count_lowshape(hand, _shape) {
   let count = 0;
   hand.forEach(function(value, key) {
     if (value == _shape) {
       if (shape(key) == "heart") {
         if (key >= 2 && key <= 6) count++;
       }
       if (shape(key) == "spade") {
         if (key >= 15 && key <= 19) count++;
       }
       if (shape(key) == "diamond") {
         if (key >= 28 && key <= 32) count++;
       }
       if (shape(key) == "club") {
         if (key >= 41 && key <= 45) count++;
       }
     }
   });

   return count;
 }

 function setshape(_shape) {

   nowshape = shape;

 }

 function countshape(hand, _shape) {
   let count = 0;
   hand.forEach(function(value, key) {
     if (value == _shape) {

       count++;

     }
   });

   return count;
 }

 function com_pass(fromhand, tohand) {
   let count = 0;
   /* As a general rule, you want to get rid of the most dangerous parts of your hand and, 
   if possible, short suit(also known as void) yourself (i.e., no cards in one suit) of clubs or diamonds. 
  (However, you may get other cards in that suit passed right back to you by an opponent who also wants to shortsuit himself of it.)**/
   if (count_shape(fromhand, "club") <= 3 && count < 3) {
     fromhand.forEach(function(value, key) {
       if (key > 39 && key <= 52 && count < 3) {
         passcard(key, fromhand, tohand);
         count++;

       }
     });

   };
   if (count_shape(fromhand, "diamond") <= 3 && count < 3) {
     fromhand.forEach(function(value, key) {
       if (key > 26 && key <= 39 && count < 3) {
         passcard(key, fromhand, tohand);
         count++;

       }
     });

   };
   /*Never short suit yourself of spades below the Queen; always keep spades valued Jack or lower. 
   If you have four or more low spades, then you don't have to worry if you have any of the high spades and should concentrate on discarding another suit. **/
   //spade 25 26 14 means spade Q K A
   if (count_lowshape(fromhand, "spade") < 4) {
     if (fromhand.has(14) && count < 3) {
       passcard(14, fromhand, tohand);
       count++;
     }
     if (fromhand.has(26) && count < 3) {
       passcard(26, fromhand, tohand);
       count++;
     }
     if (fromhand.has(25) && count < 3) {
       passcard(25, fromhand, tohand);
       count++;
     }


   };
   if (fromhand.has(26) && count < 3) {
     passcard(26, fromhand, tohand);
     count++;
   }

   /* High hearts are also dangerous if you do not have low hearts as well (2-6), and should probably be passed on. 
   Keeping low hearts can actually be advantageous because if anyone leads a heart, you can play a low one and not win the trick**/
   if (count_lowshape(fromhand, "heart") < 4) {
     if (fromhand.has(1) && count < 3) {
       passcard(1, fromhand, tohand);
       count++;
     }
     if (fromhand.has(13) && count < 3) {
       passcard(13, fromhand, tohand);
       count++;
     }
     if (fromhand.has(12) && count < 3) {
       passcard(12, fromhand, tohand);
       count++;
     }


   };

   /*pass on the 2 of clubs if you have it. 
    Because that card always starts the game, and the first trick is safe from any point-taking, 
    not having to lead the 2♣ allows you to play a high Club (which you may receive from the other player) "safely".**/

   if (count < 3 && fromhand.has(41)) {
     passcard(41, fromhand, tohand);
     count++;
   }
   /*Aces are the best cards to pass to the left. 
   The reason for this is that aces are the most likely cards to win tricks, and you want the player to your left to win tricks. 
   If she does, she will lead the next trick, allowing you to play last in the trick, so you can see exactly what to play.**/
   if (count < 3) {
     if (fromhand.has(14) && count < 3) {
       passcard(14, fromhand, tohand);
       count++;
     }
     if (fromhand.has(1) && count < 3) {
       passcard(1, fromhand, tohand);
       count++;
     }
     if (fromhand.has(27) && count < 3) {
       passcard(27, fromhand, tohand);
       count++;
     }
     if (fromhand.has(40) && count < 3) {
       passcard(40, fromhand, tohand);
       count++;
     }

   }
   /*Face card Diamonds and Clubs. 
   I might hang on to the Ace of Clubs if I don't have the 2, so I can win the first trick and choose the direction of play from there (usually either a Spade hunt or voiding Clubs/Diamonds), 
   but other face cards in these suits typically have a similar low advantage/high risk as the high Spades.**/
   if (count < 3) {
     if (fromhand.has(39) && count < 3) {
       passcard(39, fromhand, tohand);
       count++;
     }
     if (fromhand.has(38) && count < 3) {
       passcard(38, fromhand, tohand);
       count++;
     }
     if (fromhand.has(37) && count < 3) {
       passcard(37, fromhand, tohand);
       count++;
     }
     if (fromhand.has(52) && count < 3) {
       passcard(52, fromhand, tohand);
       count++;
     }
     if (fromhand.has(51) && count < 3) {
       passcard(51, fromhand, tohand);
       count++;
     }
     if (fromhand.has(50) && count < 3) {
       passcard(50, fromhand, tohand);
       count++;
     }

   }
   //Face card Hearts, if I'm short in Hearts. Again, they're dangerous, but usually playable depending on the rest of my hand.
   if (count < 3) {
     if (fromhand.has(13) && count < 3) {
       passcard(13, fromhand, tohand);
       count++;
     }
     if (fromhand.has(12) && count < 3) {
       passcard(12, fromhand, tohand);
       count++;
     }
     if (fromhand.has(11) && count < 3) {
       passcard(11, fromhand, tohand);
       count++;
     }
   }
   // random passing except low suit
   let boolean = true;
   while (boolean) {

     let ran_heart = Math.floor(Math.random() * 13) + 1;
     if (fromhand.has(ran_heart) && count < 3 && islowsuit(ran_heart) == false) {
       passcard(ran_heart, fromhand, tohand);
       count++;
     }
     let ran_diamond = Math.floor(Math.random() * 13) + 27;
     if (fromhand.has(ran_diamond) && count < 3 && islowsuit(ran_diamond) == false) {
       passcard(ran_diamond, fromhand, tohand);
       count++;
     }
     let ran_club = Math.floor(Math.random() * 13) + 40;
     if (fromhand.has(ran_club) && count < 3 && islowsuit(ran_club) == false) {
       passcard(ran_club, fromhand, tohand);
       count++;
     }

     if (count == 3) boolean = false;
     if (count > 3) throw new Error("error passing");
   }
   if (count < 3) throw new Error("error passing");


   return "done";
 }

 function specific_shape_inhand(fromhand, _shape) {
   let temp = new Map();
   for (let [key, value] of fromhand.entries()) {
     if (value === _shape)
       temp.set(key, value);
   }
   temp = sortMapByKEY(temp);
   return temp;


 }


 function isAce(num) {
   if (num == 1) return true;
   if (num == 14) return true;
   if (num == 27) return true;
   if (num == 40) return true;

   return false;
 }

 function return_biggestcard(temp, _shape) {
   temp = specific_shape_inhand(temp, _shape);
   temp = sortMapByKEY(temp);
   if (!temp instanceof Map) throw new Error("not a hand");
   if (temp.size == 0) throw new Error("no shape " + _shape + " card at all");
   if (temp.has(1)) {
     return 1;
   } else if (temp.has(14)) {
     return 14;
   } else if (temp.has(27)) {
     return 27;
   } else if (temp.has(40)) {
     return 40;
   }

   let Max = Math.max(...temp.keys());

   return Max;
 }

 function return_smallercard(temp, num, _shape) {
   temp = specific_shape_inhand(temp, _shape);
   temp = sortMapByKEY(temp);
   let result = -1;
   if (num == 1) num += 999;
   if (num == 14) num += 999;
   if (num == 27) num += 999;
   if (num == 40) num += 999;

   temp.forEach(function(value, key) {
     if (key < num && isAce(key) == false) result = key;
     if (key >= num) return result;
   });
   return result;


 }

 function return_smallestcard(temp, _shape) {
   temp = specific_shape_inhand(temp, _shape);
   temp = sortMapByKEY(temp);
   let result = -1;
   if (!temp instanceof Map) throw new Error("not a hand");
   temp.forEach(function(value, key) {

     if (isAce(key) == false && result == -1) {
       result = key;
     }

   });
   if (result != -1) {
     return result;
   }
   if (result == -1) {
     temp.forEach(function(value, key) {
       result = key;
     })
     return result;
   }
   throw new Error("should not run here");

 }

 function com_play(fromhand, flag) {
   let temp = specific_shape_inhand(fromhand, nowshape);
   let Max = 0;
   let Min = 0;
   if (temp.size != 0 && nowshape != "empty") {
     if (round == 1) {
       if (temp.has(41)) {
         passcard(41, fromhand, board);
         return "done";
       }
       Max = return_biggestcard(temp, nowshape);
       passcard(Max, fromhand, board);
       return "done";
     }
     if (round != 1) {
       if (cardplayed.has(25)) { //spade q has been played
         if (nowshape != "heart") {
           Max = return_biggestcard(temp, nowshape);
           passcard(Max, fromhand, board);
           return "done";
         } else {
           Min = return_smallercard(temp, return_biggestcard(board, nowshape), nowshape);
           if (Min == -1) {
             Max = return_biggestcard(temp, nowshape);
             passcard(Max, fromhand, board);
             return "done";
           }
           passcard(Min, fromhand, board);
           return "done";

         }

       }
       if (!cardplayed.has(25)) {
         if (board.has(25)) {
           Min = return_smallercard(temp, 25, nowshape);
           if (Min == -1) {
             Max = return_biggestcard(temp, nowshape);
             passcard(Max, fromhand, board);
             return "done";
           }
           passcard(Min, fromhand, board);
           return "done"
         } else {
           if (nowshape == "spade") {
             if (flag == 4 && !board.has(25)) {
               if (temp.has(25)) temp.delete(25);
               if (temp.size > 0) {
                 Max = return_biggestcard(temp, nowshape);
                 passcard(Max, fromhand, board);
                 return "done";
               }
             }
             temp = specific_shape_inhand(fromhand, nowshape);
             Min = return_smallercard(temp, return_biggestcard(board, nowshape), nowshape);
             if (Min == -1) {
               Max = return_biggestcard(temp, nowshape);
               passcard(Max, fromhand, board);
               return "done";
             }
             passcard(Min, fromhand, board);
             return "done";
           } else if (nowshape == "heart") {
             Min = return_smallercard(temp, return_biggestcard(board, nowshape), nowshape);
             if (Min == -1) {
               Max = return_biggestcard(temp, nowshape);
               passcard(Max, fromhand, board);
               return "done";
             }
             passcard(Min, fromhand, board);
             return "done";
           } else {
             if (hasheart() == true) {
               Min = return_smallercard(temp, return_biggestcard(board, nowshape), nowshape);
               if (Min == -1) {
                 Max = return_biggestcard(temp, nowshape);
                 passcard(Max, fromhand, board);
                 return "done";
               }
               passcard(Min, fromhand, board);
               return "done";

             }
             Max = return_biggestcard(temp, nowshape);
             passcard(Max, fromhand, board);
             return "done";

           }

         }

       }


     }
   } else if (temp.size == 0 && nowshape != "empty") {
     if (round == 1) {
       temp = specific_shape_inhand(fromhand, "spade");
       if (temp.has(14)) {
         passcard(14, fromhand, board);
         return "done";
       }
       if (temp.has(26)) {
         passcard(26, fromhand, board);
         return "done";
       }


       temp = specific_shape_inhand(fromhand, "diamond");
       if (temp.size != 0) {
         Max = return_biggestcard(temp, "diamond");
         passcard(Max, fromhand, board);
         return "done";
       }
       temp = specific_shape_inhand(fromhand, "spade");
       if (temp.has(25)) temp.delete(25);
       if (temp.size != 0) {
         Max = return_biggestcard(temp, "spade");
         passcard(Max, fromhand, board);
         return "done";
       }


     }
     if (round != 1) {
       if (cardplayed.has(25) || board.has(25)) {
         if (countshape(fromhand, "heart") < 3 && countshape(fromhand, "heart") != 0) {
           temp = specific_shape_inhand(fromhand, "heart");
           Max = return_biggestcard(temp, "heart");
           passcard(Max, fromhand, board);
           return "done";
         }
         if (countshape(fromhand, "club") < 3 && countshape(fromhand, "club") != 0) {
           temp = specific_shape_inhand(fromhand, "club");
           Max = return_biggestcard(temp, "club");
           passcard(Max, fromhand, board);
           return "done";
         }
         if (countshape(fromhand, "diamond") < 3 && countshape(fromhand, "diamond") != 0) {
           temp = specific_shape_inhand(fromhand, "diamond");
           Max = return_biggestcard(temp, "diamond");
           passcard(Max, fromhand, board);
           return "done";
         }
         if (countshape(fromhand, "spade") < 3 && countshape(fromhand, "spade") != 0) {
           temp = specific_shape_inhand(fromhand, "spade");
           Max = return_biggestcard(temp, "spade");
           passcard(Max, fromhand, board);
           return "done";
         }
         temp = specific_shape_inhand(fromhand, "heart");
         if (temp.has(1)) {
           passcard(1, fromhand, board);
           return "done";
         }
         if (temp.has(13)) {
           passcard(13, fromhand, board);
           return "done";
         }
         if (temp.has(12)) {
           passcard(12, fromhand, board);
           return "done";
         }
         if (temp.has(11)) {
           passcard(11, fromhand, board);
           return "done";
         }
         temp = specific_shape_inhand(fromhand, "spade");
         if (temp.has(14)) {
           passcard(14, fromhand, board);
           return "done";
         }
         if (temp.has(26)) {
           passcard(26, fromhand, board);
           return "done";
         }
         if (temp.has(25)) {
           passcard(25, fromhand, board);
           return "done";
         }
         if (temp.has(24)) {
           passcard(24, fromhand, board);
           return "done";
         }
         temp = specific_shape_inhand(fromhand, "diamond");
         if (temp.has(27)) {
           passcard(27, fromhand, board);
           return "done";
         }
         if (temp.has(39)) {
           passcard(39, fromhand, board);
           return "done";
         }
         if (temp.has(38)) {
           passcard(38, fromhand, board);
           return "done";
         }
         if (temp.has(37)) {
           passcard(37, fromhand, board);
           return "done";
         }
         temp = specific_shape_inhand(fromhand, "club");
         if (temp.has(40)) {
           passcard(40, fromhand, board);
           return "done";
         }
         if (temp.has(52)) {
           passcard(52, fromhand, board);
           return "done";
         }
         if (temp.has(51)) {
           passcard(51, fromhand, board);
           return "done";
         }
         if (temp.has(50)) {
           passcard(50, fromhand, board);
           return "done";
         }
         temp = specific_shape_inhand(fromhand, "heart");
         if (temp.size != 0) {
           Max = return_biggestcard(temp, "heart");
           passcard(Max, fromhand, board);
           return "done";
         }
         temp = specific_shape_inhand(fromhand, "club");
         if (temp.size != 0) {
           Max = return_biggestcard(temp, "club");
           passcard(Max, fromhand, board);
           return "done";
         }
         temp = specific_shape_inhand(fromhand, "diamond");
         if (temp.size != 0) {
           Max = return_biggestcard(temp, "diamond");
           passcard(Max, fromhand, board);
           return "done";
         }
         temp = specific_shape_inhand(fromhand, "spade");
         if (temp.size != 0) {
           Max = return_biggestcard(temp, "spade");
           passcard(Max, fromhand, board);
           return "done";
         }


       }
       if (!cardplayed.has(25)) {
         temp = specific_shape_inhand(fromhand, "spade");
         if (temp.has(25)) {
           passcard(25, fromhand, board);
           return "done";
         }
         if (temp.has(14)) {
           passcard(14, fromhand, board);
           return "done";
         }
         if (temp.has(26)) {
           passcard(26, fromhand, board);
           return "done";
         }
         temp = specific_shape_inhand(fromhand, "heart");
         if (temp.has(1)) {
           passcard(1, fromhand, board);
           return "done";
         }
         if (temp.has(13)) {
           passcard(13, fromhand, board);
           return "done";
         }
         if (temp.has(12)) {
           passcard(12, fromhand, board);
           return "done";
         }
         temp = specific_shape_inhand(fromhand, "diamond");
         if (temp.has(27)) {
           passcard(27, fromhand, board);
           return "done";
         }
         if (temp.has(39)) {
           passcard(39, fromhand, board);
           return "done";
         }
         if (temp.has(38)) {
           passcard(38, fromhand, board);
           return "done";
         }
         temp = specific_shape_inhand(fromhand, "club");
         if (temp.has(40)) {
           passcard(40, fromhand, board);
           return "done";
         }
         if (temp.has(52)) {
           passcard(52, fromhand, board);
           return "done";
         }
         if (temp.has(51)) {
           passcard(51, fromhand, board);
           return "done";
         }
         if (countshape(fromhand, "heart") < 3 && countshape(fromhand, "heart") != 0) {
           temp = specific_shape_inhand(fromhand, "heart");
           Max = return_biggestcard(temp, "heart");
           passcard(Max, fromhand, board);
           return "done";
         }
         if (countshape(fromhand, "club") < 3 && countshape(fromhand, "club") != 0) {
           temp = specific_shape_inhand(fromhand, "club");
           Max = return_biggestcard(temp, "club");
           passcard(Max, fromhand, board);
           return "done";
         }
         if (countshape(fromhand, "diamond") < 3 && countshape(fromhand, "diamond") != 0) {
           temp = specific_shape_inhand(fromhand, "diamond");
           Max = return_biggestcard(temp, "diamond");
           passcard(Max, fromhand, board);
           return "done";
         }
         temp = specific_shape_inhand(fromhand, "heart");
         if (temp.size != 0) {
           Max = return_biggestcard(temp, "heart");
           passcard(Max, fromhand, board);
           return "done";
         }
         temp = specific_shape_inhand(fromhand, "club");
         if (temp.size != 0) {
           Max = return_biggestcard(temp, "club");
           passcard(Max, fromhand, board);
           return "done";
         }
         temp = specific_shape_inhand(fromhand, "diamond");
         if (temp.size != 0) {
           Max = return_biggestcard(temp, "diamond");
           passcard(Max, fromhand, board);
           return "done";
         }
         temp = specific_shape_inhand(fromhand, "spade");
         if (temp.size != 0) {
           Max = return_biggestcard(temp, "spade");
           passcard(Max, fromhand, board);
           return "done";
         }

       }

     }
   }
   if (nowshape == "empty") {
     if (!cardplayed.has(25) && !fromhand.has(25)) {
       temp = specific_shape_inhand(fromhand, "spade");
       Min = return_smallercard(temp, 25, "spade");
       if (Min != -1) {
         nowshape = "spade";
         passcard(Min, fromhand, board);
         return "done";
       }
     }
     let bool = false;
     if (canplayheart == true) {

       temp = specific_shape_inhand(fromhand, "heart");
       for (const [key, value] of temp) {
         if (key > 1 && key <= 5 && bool == false) {
           nowshape = "heart";
           bool = true;
           passcard(key, fromhand, board);
           return "done";
         }
       }


     }
     temp = specific_shape_inhand(fromhand, "spade");
     for (const [key, value] of temp) {
       if (key > 14 && key <= 18 && bool == false) {
         nowshape = "spade";
         bool = true;
         passcard(key, fromhand, board);
         return "done";
       }
     }
     temp = specific_shape_inhand(fromhand, "diamond");
     for (const [key, value] of temp) {
       if (key > 27 && key <= 31 && bool == false) {
         nowshape = "diamond";
         bool = true;
         passcard(key, fromhand, board);
         return "done";
       }
     }
     temp = specific_shape_inhand(fromhand, "club");
     for (const [key, value] of temp) {
       if (key > 40 && key <= 44 && bool == false) {
         nowshape = "club";
         bool = true;
         passcard(key, fromhand, board);
         return "done";
       }
     }
     temp = specific_shape_inhand(fromhand, "spade");
     for (const [key, value] of temp) {
       if (key > 18 && key <= 22 && bool == false) {
         nowshape = "spade";
         bool = true;
         passcard(key, fromhand, board);
         return "done";
       }
     }
     temp = specific_shape_inhand(fromhand, "diamond");
     for (const [key, value] of temp) {
       if (key > 31 && key <= 35 && bool == false) {
         nowshape = "diamond";
         bool = true;
         passcard(key, fromhand, board);
         return "done";
       }
     }
     temp = specific_shape_inhand(fromhand, "club");
     for (const [key, value] of temp) {
       if (key > 44 && key <= 48 && bool == false) {
         nowshape = "club";
         bool = true;
         passcard(key, fromhand, board);
         return "done";
       }
     }
     if (countshape(fromhand, "diamond") != 0) {
       nowshape = "diamond";
       Min = return_smallestcard(fromhand, "diamond");
       passcard(Min, fromhand, board);
       return "done";
     }
     if (countshape(fromhand, "club") != 0) {
       nowshape = "club";
       Min = return_smallestcard(fromhand, "club");
       passcard(Min, fromhand, board);
       return "done";
     }
     if (canplayheart == true && countshape(fromhand, "heart") != 0) {
       nowshape = "heart";
       Min = return_smallestcard(fromhand, "heart");
       passcard(Min, fromhand, board);
       return "done";


     }
     temp = specific_shape_inhand(fromhand, "spade");
     for (const [key, value] of temp) {
       if (bool == false) {
         nowshape = "spade";
         bool = true;
         passcard(key, fromhand, board);
         return "done";
       }
     }
     if (countshape(fromhand, "heart") != 0) {
       nowshape = "heart";
       Min = return_smallestcard(fromhand, "heart");
       passcard(Min, fromhand, board);
       return "done";


     }

   }
   console.log("-------yourhand----");
   console.log(yourhand);
   console.log("-------lefthand----");
   console.log(lefthand);
   console.log("-------tophand----");
   console.log(tophand);
   console.log("-------righthand----");
   console.log(righthand);
   console.log("-------end----");
   console.log(order);
   console.log(board);

   throw new Error("should not reach here");
 }

 function scoring() {
   let score = 0;
   board.forEach(function(value, key) {
     if (value == "heart") {
       score++;
     } else if (key == 25) {
       score += 13;
     }
   });
   return score;

 }

 function whoisbigger() {
   let Max = 0;
   let temp = specific_shape_inhand(board, nowshape);
   Max = return_biggestcard(temp, nowshape);
   let counter = 1;
   let bool = false;
   board.forEach(function(value, key) {
     if (key == Max) bool = true;
     if (bool == false) counter++;
   });
   return counter;
 }

 function game() {
   if (countshape(board, "heart") > 0) canplayheart = true;
   round++;
   let score = scoring();
   let index = whoisbigger();
   index--;
   if (order[index] == "your") yourscore += score;
   if (order[index] == "left") leftscore += score;
   if (order[index] == "top") topscore += score;
   if (order[index] == "right") rightscore += score;
   if (order[index] == "your") {
     order = ["your", "left", "top", "right"];
   } else if (order[index] == "left") {
     order = ["left", "top", "right", "your"];
   } else if (order[index] == "top") {
     order = ["top", "right", "your", "left"];
   } else if (order[index] == "right") {
     order = ["right", "your", "left", "top"];
   }

   hasplayed();
   board.clear();
   nowshape = "empty";
   if (round <= 13) {
     whoplay();
   }
 }

 function whoplay() {
   if (order[0] == "your") {
     com_play(yourhand, 1);
     com_play(lefthand, 2);
     com_play(tophand, 3);
     com_play(righthand, 4);
   }
   if (order[0] == "left") {
     com_play(lefthand, 1);
     com_play(tophand, 2);
     com_play(righthand, 3);
     com_play(yourhand, 4)
   }
   if (order[0] == "top") {
     com_play(tophand, 1);
     com_play(righthand, 2);
     com_play(yourhand, 3);
     com_play(lefthand, 4);
   }
   if (order[0] == "right") {
     com_play(righthand, 1);
     com_play(yourhand, 2);
     com_play(lefthand, 3);
     com_play(tophand, 4);
   }
 }


  function fullgame() {

   resetboard();
   shuffle();

   console.log(com_pass(yourhand, lefthand));
   console.log(com_pass(lefthand, tophand));
   console.log(com_pass(tophand, righthand));
   console.log(com_pass(righthand, yourhand));
   sort();
   whofirst();
   whoplay();
   for (let i = 0; i < 13; i++) {
     console.log(order);
     console.log(board);
     game();
   }

   console.log("--------------yourscore-----------------------");
   console.log(yourscore);
   console.log("--------------leftscore-----------------------");
   console.log(leftscore);
   console.log("--------------rightscore-----------------------");
   console.log(rightscore);
   console.log("--------------topscore-----------------------");
   console.log(topscore);
 }
fullgame();