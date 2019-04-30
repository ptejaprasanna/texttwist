<?php
function generate_rack($n){
  $tileBag = "AAAAAAAAABBCCDDDDEEEEEEEEEEEEFFGGGHHIIIIIIIIIJKLLLLMMNNNNNNOOOOOOOOPPQRRRRRRSSSSTTTTTTUUUUVVWWXYYZ";
  $rack_letters = substr(str_shuffle($tileBag), 0, $n);

  $temp = str_split($rack_letters);
  sort($temp);
  return implode($temp);
};
$myrack = generate_rack(7);
$racks = [];
for($i = 0; $i < pow(2, strlen($myrack)); $i++){
	$ans = "";
	for($j = 0; $j < strlen($myrack); $j++){
		if (($i >> $j) % 2) {
		  $ans .= $myrack[$j];
		}
	}
	if (strlen($ans) > 1){
  	    $racks[] = $ans;
	}
}
$racks = array_unique($racks);
$realWords = [];
$dbhandle = new PDO("sqlite:scrabble.sqlite") or die("Failed to open DB");
     if (!$dbhandle) die ($error);

foreach($racks as $rack){
    $query = "SELECT words FROM racks WHERE rack='$rack'";
    $statement = $dbhandle->prepare($query);
    $statement->execute();
    $temp_results = $statement->fetchAll(PDO::FETCH_ASSOC);
     if(sizeof($temp_results) > 0){
        $temp_results = $temp_results[0][words];
        $temp_results = explode("@@", $temp_results);
     }

    foreach($temp_results as $word)
        $realWords[] = $word;
}
$realWords = array_unique($realWords);
$results = [];
$results = array("tile" => $myrack, "words" => $realWords);

    header('HTTP/1.1 200 OK');
    //this lets the browser know to expect json
    header('Content-Type: application/json');
    //this creates json and gives it back to the browser
    echo json_encode($results);
?>
