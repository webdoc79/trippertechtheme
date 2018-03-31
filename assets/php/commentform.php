<?php

/* VARIABLES */

// Type in your email address to receive the mail
$to				= "youremail@gmail.com";
$subject	= "Sample message from Apex";

// If you wish to show a logo in the mail, paste the URL here.
// For example: http://mywebsite.com/mylogo.png
// Remember http://
$logo_url = "";

/* VARIABLES END */

if( isset($_POST['submit']) ) {

	$name				= $_POST['name'];
	$email		  = $_POST['email'];
	$message		= $_POST['message'];
	$ip_address = $_SERVER['REMOTE_ADDR'];
	$antispam 	= (isset($_POST['url']) && $_POST['url'] == '') ? true : false;
	
	if( $name == "" || $email == "" || $message == "" ) {
	  echo 'One or more fields has not been filled out.<br>
	  Please go back and try again.';
	
	} elseif( !filter_var($email, FILTER_VALIDATE_EMAIL) ) {
    echo 'The email address could not be validated.<br>
    Please go back and verify your email address.';
	
	} else { // All checks passed
	
    if( isset($logo_url) && strlen($logo_url) > 3 ) {
      $logo = '<img src="'.$logo_url.'" alt="" style="border:none;"><br><br>';
    } else { 
      $logo = ""; 
    }
    
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=utf-8\r\n";
    $content = '<html><head><style>body { font-family: Verdana; font-size: 12px; }</style></head><body>';
    $content .= "$logo
New mail from:<br><br>
Name: $name <br>
Email: $email <br>
IP: $ip_address <br><br>

Message:<br>".nl2br($message)."

</body></html>";
		
		// If spam check has passed, attempt to send the mail
		if( $antispam ) {
	    $sendMail = mail($to, $subject, $content, $headers);
	    if( $sendMail ) {
		    echo '<p>Thank you, the mail has been successfully sent!</p>';
	    } else {
	      echo '<p>An error occured and the mail could not be sent.<br>Please try again later.</p>';
	    }
	    
	  // If the spam check failed, do not send mail but let spammers think it did
    } else {
	    echo '<p>Thank you, the mail has been successfully sent!</p>';
    }
	}
} else {
	echo '<p>An error occured and the mail could not be sent.<br>Please try again later.</p>';
}