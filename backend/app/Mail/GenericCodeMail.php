namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class GenericCodeMail extends Mailable
{
    use Queueable, SerializesModels;

    public $content;
    public $subjectLine;

    public function __construct($content, $subjectLine)
    {
        $this->content = $content;
        $this->subjectLine = $subjectLine;
    }

    public function build()
    {
        return $this->subject($this->subjectLine)
            ->text('emails.generic_code_plain');
    }
}
