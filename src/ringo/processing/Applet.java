package ringo.processing;

import processing.core.PApplet;
import org.mozilla.javascript.WrappedException;

public class Applet extends PApplet {
    
    public boolean looping() {
        return this.looping;
    }
    
    public void adapterSetup() {}
    
    public void setup() {
        try {
            adapterSetup();
        } catch (WrappedException e) {
            if (e.getWrappedException() instanceof RuntimeException) {
                throw (RuntimeException) e.getWrappedException();
            } else {
                throw e;
            }
        }
    }
    
}